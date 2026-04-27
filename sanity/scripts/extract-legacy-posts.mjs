import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const CONFIG = {
	baseUrl: "https://ninnakallin.se",
	oneWebSitemap: "https://ninnakallin.se/onewebstatic/sitemap.xml",
	blogSitemap:
		"https://blogbuilder.one.com/public/onecom/ninnakallin.se/sitemap.xml?id=a40d9e4b-a10c-439d-8bbf-9076639590ed&path=/blogg",
};

const HEADING_STOP_WORDS = new Set([
	"kommentarer",
	"dela den har sidan",
	"dela pa",
	"alla inlagg",
]);

const HEADING_SKIP_WORDS = new Set([
	"ninnas",
	"dagbok",
	"blogg",
	"hemma",
	"lite om mig",
	"i",
]);

function normalizeText(value) {
	return value
		.replace(/\u00a0/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function normalizeKey(value) {
	return normalizeText(value)
		.toLowerCase()
		.replace(/[^a-z0-9\s]/gi, "")
		.trim();
}

function parseLocTags(xmlText) {
	const locRegex = /<loc>([^<]+)<\/loc>/g;
	const found = [];
	let match = null;
	while ((match = locRegex.exec(xmlText)) !== null) {
		found.push(match[1].replace(/&amp;/g, "&"));
	}
	return [...new Set(found)];
}

async function fetchText(url) {
	for (let attempt = 1; attempt <= 4; attempt += 1) {
		const response = await fetch(url, {
			headers: {
				"user-agent": "levnadsglad-content-migration/1.0",
				"accept-language": "sv-SE,sv;q=0.9,en;q=0.8",
			},
		});

		if (response.ok) {
			return response.text();
		}

		if (response.status !== 429 || attempt === 4) {
			throw new Error(
				`Failed to fetch ${url}: ${response.status} ${response.statusText}`,
			);
		}

		const retryAfterSeconds = Number(
			response.headers.get("retry-after") || "0",
		);
		const backoffMs =
			retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : 2000 * attempt;
		await new Promise((resolve) => {
			setTimeout(resolve, backoffMs);
		});
	}

	throw new Error(`Failed to fetch ${url}: retry attempts exhausted`);
}

function toAbsoluteUrl(url) {
	if (/^https?:\/\//i.test(url)) {
		return url;
	}
	return new URL(url, CONFIG.baseUrl).toString();
}

function normalizeUrlForKey(url) {
	const parsed = new URL(toAbsoluteUrl(url));
	const pathname = parsed.pathname.replace(/\/+$/, "") || "/";
	return `${parsed.origin}${pathname}`;
}

function isBlogPostUrl(url) {
	const parsed = new URL(url);
	if (!parsed.pathname.startsWith("/blogg")) {
		return false;
	}
	return parsed.pathname !== "/blogg/" && parsed.pathname !== "/blogg";
}

function isPotentialDagbokPageUrl(url) {
	const parsed = new URL(url);
	if (parsed.pathname.startsWith("/blogg")) {
		return false;
	}
	if (parsed.pathname === "/" || parsed.pathname === "/hemma") {
		return false;
	}
	return true;
}

function slugify(value) {
	const chars = value
		.toLowerCase()
		.replace(/[\u00e5\u00c5]/g, "a")
		.replace(/[\u00e4\u00c4]/g, "a")
		.replace(/[\u00f6\u00d6]/g, "o")
		.replace(/[^a-z0-9\s-]/g, " ")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

	return chars || "untitled";
}

function createId(seed) {
	return createHash("sha1").update(seed).digest("hex").slice(0, 16);
}

function parseSectionMap(html) {
	const $ = cheerio.load(html);
	const sectionMap = new Map();

	for (const item of $(".menu .menu1 > li").toArray()) {
		const topLink = $(item).find(
			"> a.level-0, > a.selected.level-0, > a.expandable.level-0",
		);
		const topName = normalizeText(topLink.text());
		const topHref = topLink.attr("href");

		if (!topName || !topHref) {
			continue;
		}

		const topUrlKey = normalizeUrlForKey(topHref);
		sectionMap.set(topUrlKey, {
			sectionName: topName,
			sectionSlug: slugify(topName),
			subsectionName: null,
		});

		for (const subLink of $(item).find("ul.menu1 li a").toArray()) {
			const subName = normalizeText($(subLink).text());
			const subHref = $(subLink).attr("href");
			if (!subName || !subHref) {
				continue;
			}

			const subUrlKey = normalizeUrlForKey(subHref);
			sectionMap.set(subUrlKey, {
				sectionName: topName,
				sectionSlug: slugify(topName),
				subsectionName: subName,
			});
		}
	}

	if (!sectionMap.has(normalizeUrlForKey("/blogg"))) {
		sectionMap.set(normalizeUrlForKey("/blogg"), {
			sectionName: "Blogg",
			sectionSlug: "blogg",
			subsectionName: null,
		});
	}

	return sectionMap;
}

function getSectionMeta(sourceUrl, sectionMap) {
	const sourceKey = normalizeUrlForKey(sourceUrl);
	const direct = sectionMap.get(sourceKey);
	if (direct) {
		return direct;
	}

	const sourcePath = new URL(sourceUrl).pathname;
	const blogRootKey = normalizeUrlForKey("/blogg");
	if (sourcePath.startsWith("/blogg/")) {
		const blogMeta = sectionMap.get(blogRootKey);
		if (blogMeta) {
			return blogMeta;
		}
		return {
			sectionName: "Blogg",
			sectionSlug: "blogg",
			subsectionName: null,
		};
	}

	for (const [key, value] of sectionMap.entries()) {
		const keyPath = new URL(key).pathname;
		if (keyPath === "/" || keyPath === "/blogg") {
			continue;
		}
		if (sourcePath.startsWith(keyPath + "/")) {
			return value;
		}
	}

	return {
		sectionName: "Unmapped",
		sectionSlug: "unmapped",
		subsectionName: null,
	};
}

function getTextContainers($) {
	const candidates = $(
		"div[data-specific-kind='TEXT'] .styles_contentContainer__lrPIa",
	)
		.toArray()
		.map((node) => $(node))
		.filter((node) => normalizeText(node.text()).length > 100);

	if (candidates.length > 0) {
		return candidates;
	}

	return [$("body").first()];
}

function shouldSkipHeading(heading) {
	const key = normalizeKey(heading);
	return HEADING_SKIP_WORDS.has(key);
}

function shouldStopOnHeading(heading) {
	const key = normalizeKey(heading);
	return HEADING_STOP_WORDS.has(key);
}

function cleanupBodyLines(lines) {
	const uniqueLines = [];
	for (const line of lines) {
		if (!line) {
			continue;
		}
		if (
			uniqueLines.length > 0 &&
			uniqueLines[uniqueLines.length - 1] === line
		) {
			continue;
		}
		uniqueLines.push(line);
	}
	return uniqueLines;
}

function parseEntriesFromContainer($, root) {
	const nodes = root.find("h1, h2, h3, p, li, a, img").toArray();
	const entries = [];
	let current = null;

	for (const node of nodes) {
		const tag = node.tagName.toLowerCase();
		const text = normalizeText($(node).text());

		if (tag === "h1" || tag === "h2" || tag === "h3") {
			if (!text) {
				continue;
			}
			if (shouldStopOnHeading(text)) {
				break;
			}
			if (shouldSkipHeading(text)) {
				continue;
			}

			if (current && current.bodyLines.length > 0) {
				entries.push(current);
			}

			current = {
				title: text,
				bodyLines: [],
				imageUrls: new Set(),
			};
			continue;
		}

		if (!current) {
			continue;
		}

		if (tag === "a") {
			const href = $(node).attr("href");
			if (href && href.includes("usercontent.one")) {
				current.imageUrls.add(href);
			}
		}

		if (tag === "img") {
			const src = $(node).attr("src");
			if (src && src.includes("usercontent.one")) {
				current.imageUrls.add(src);
			}
		}

		if ((tag === "p" || tag === "li") && text) {
			if (!text.startsWith("http://") && !text.startsWith("https://")) {
				current.bodyLines.push(text);
			}
		}
	}

	if (current && current.bodyLines.length > 0) {
		entries.push(current);
	}

	return entries;
}

function parseDagbokEntries(html, url) {
	const $ = cheerio.load(html);
	$("script, style, noscript").remove();

	const containers = getTextContainers($);
	const entries = [];
	for (const container of containers) {
		entries.push(...parseEntriesFromContainer($, container));
	}

	const deduped = new Map();
	for (const entry of entries) {
		const body = cleanupBodyLines(entry.bodyLines).join("\n\n");
		if (body.length < 120) {
			continue;
		}
		const key = `${normalizeKey(entry.title)}::${normalizeKey(body.slice(0, 200))}`;
		if (!deduped.has(key)) {
			deduped.set(key, {
				sourceType: "dagbok",
				sourceUrl: url,
				title: entry.title,
				body,
			});
		}
	}

	return [...deduped.values()];
}

function parseBlogPostEntry(html, url) {
	const $ = cheerio.load(html);
	$("script, style, noscript").remove();

	const root = $("[data-element-id='blog-layout']").first();
	const scope = root.length ? root : $("body").first();

	const title = normalizeText(
		scope
			.find("h1")
			.toArray()
			.map((el) => normalizeText($(el).text()))
			.find((candidate) => candidate && candidate.toLowerCase() !== "blogg") ||
			"",
	);

	if (!title) {
		return null;
	}

	const paragraphs = [];
	for (const p of scope.find("p").toArray()) {
		const line = normalizeText($(p).text());
		if (!line) {
			continue;
		}
		if (line.startsWith("Dela pa")) {
			break;
		}
		paragraphs.push(line);
	}

	let body = cleanupBodyLines(paragraphs).join("\n\n");
	if (!body) {
		body = normalizeText(scope.text());
	}

	return {
		sourceType: "blogbuilder",
		sourceUrl: url,
		title,
		body,
	};
}

function dedupeRecords(records) {
	const byKey = new Map();
	let duplicatesRemoved = 0;

	for (const record of records) {
		const key = `${normalizeKey(record.title)}::${normalizeKey(record.body.slice(0, 220))}`;
		if (!byKey.has(key)) {
			byKey.set(key, record);
			continue;
		}

		duplicatesRemoved += 1;
		const existing = byKey.get(key);
		if (record.body.length > existing.body.length) {
			byKey.set(key, {
				...record,
			});
		}
	}

	return {
		records: [...byKey.values()],
		duplicatesRemoved,
	};
}

function enrichRecords(records, sectionMap) {
	return records.map((record) => {
		const sectionMeta = getSectionMeta(record.sourceUrl, sectionMap);
		const seed = `${record.sourceType}|${record.sourceUrl}|${record.title}|${record.body.slice(0, 120)}`;
		return {
			id: createId(seed),
			slugCandidate: slugify(record.title),
			sectionName: sectionMeta.sectionName,
			sectionSlug: sectionMeta.sectionSlug,
			subsectionName: sectionMeta.subsectionName,
			...record,
		};
	});
}

async function main() {
	const oneWebSitemapText = await fetchText(CONFIG.oneWebSitemap);
	const blogSitemapText = await fetchText(CONFIG.blogSitemap);

	const oneWebUrls = parseLocTags(oneWebSitemapText).map(toAbsoluteUrl);
	const blogUrls = parseLocTags(blogSitemapText).map(toAbsoluteUrl);
	const homeHtml = await fetchText(CONFIG.baseUrl);
	const sectionMap = parseSectionMap(homeHtml);

	const dagbokLikeUrls = oneWebUrls.filter(isPotentialDagbokPageUrl);
	const blogPostUrls = blogUrls.filter(isBlogPostUrl);

	const rawRecords = [];
	const failedUrls = [];

	for (const url of blogPostUrls) {
		try {
			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			});
			const html = await fetchText(url);
			const post = parseBlogPostEntry(html, url);
			if (post) {
				rawRecords.push(post);
			}
		} catch (error) {
			failedUrls.push({ url, error: String(error) });
		}
	}

	for (const url of dagbokLikeUrls) {
		try {
			await new Promise((resolve) => {
				setTimeout(resolve, 900);
			});
			const html = await fetchText(url);
			const entries = parseDagbokEntries(html, url);
			rawRecords.push(...entries);
		} catch (error) {
			failedUrls.push({ url, error: String(error) });
		}
	}

	const rawWithMeta = enrichRecords(rawRecords, sectionMap);
	const dedupeResult = dedupeRecords(rawWithMeta);
	const cleanedRecords = dedupeResult.records;

	const report = {
		extractedAt: new Date().toISOString(),
		sources: {
			oneWebSitemap: CONFIG.oneWebSitemap,
			blogSitemap: CONFIG.blogSitemap,
		},
		discovery: {
			oneWebUrlCount: oneWebUrls.length,
			blogUrlCount: blogUrls.length,
			dagbokLikeUrlCount: dagbokLikeUrls.length,
			blogPostUrlCount: blogPostUrls.length,
		},
		results: {
			rawRecordCount: rawWithMeta.length,
			cleanRecordCount: cleanedRecords.length,
			duplicatesRemoved: dedupeResult.duplicatesRemoved,
			shortBodyCount: cleanedRecords.filter(
				(record) => record.body.length < 240,
			).length,
			unmappedSectionCount: cleanedRecords.filter(
				(record) => record.sectionSlug === "unmapped",
			).length,
			sectionCoverage: cleanedRecords.reduce((acc, record) => {
				const key = record.sectionName;
				acc[key] = (acc[key] || 0) + 1;
				return acc;
			}, {}),
		},
		failedUrls,
	};

	const projectRoot = path.resolve(
		path.dirname(fileURLToPath(import.meta.url)),
		"..",
	);
	const outputDir = path.join(projectRoot, "data", "extraction");
	await mkdir(outputDir, { recursive: true });

	await writeFile(
		path.join(outputDir, "legacy-posts-raw.json"),
		JSON.stringify(rawWithMeta, null, 2) + "\n",
		"utf-8",
	);
	await writeFile(
		path.join(outputDir, "legacy-posts-clean.json"),
		JSON.stringify(cleanedRecords, null, 2) + "\n",
		"utf-8",
	);
	await writeFile(
		path.join(outputDir, "report.json"),
		JSON.stringify(report, null, 2) + "\n",
		"utf-8",
	);

	console.log(`Extraction complete.`);
	console.log(`Raw records: ${rawWithMeta.length}`);
	console.log(`Clean records: ${cleanedRecords.length}`);
	console.log(`Output: ${outputDir}`);
	if (failedUrls.length > 0) {
		console.log(`Failed URLs: ${failedUrls.length}`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
