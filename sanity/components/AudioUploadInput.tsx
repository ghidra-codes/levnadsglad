import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { useRef, useState } from "react";
import { type ObjectInputProps, type PatchEvent, set, unset } from "sanity";

import { supabase } from "../lib/supabase";

type AudioValue = {
	url?: string;
	storage_path?: string;
	file_name?: string;
	file_size?: number;
};

type Props = ObjectInputProps<AudioValue> & {
	onChange: (patch: PatchEvent) => void;
};

const AudioUploadInput = ({ value, onChange }: Props) => {
	const [uploading, setUploading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const maxFileSize = 50 * 1024 * 1024;
	const allowedMimeType = "audio/mpeg";

	// HANDLERS

	const resetInput = () => {
		if (inputRef.current) inputRef.current.value = "";
	};

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) return;

		setErrorMessage(null);

		// VALIDATION

		if (file.type !== allowedMimeType) {
			setErrorMessage("Endast MP3-filer kan laddas upp.");
			resetInput();
			return;
		}

		if (file.size > maxFileSize) {
			setErrorMessage("Ljudfilen får inte vara större än 50 MB.");
			resetInput();
			return;
		}

		try {
			setUploading(true);

			const fileExtension = file.name.split(".").pop();

			if (!fileExtension) throw new Error("Invalid file extension.");

			const storagePath = `${crypto.randomUUID()}.${fileExtension}`;

			// UPLOAD

			const { error: uploadError } = await supabase.storage.from("audio").upload(storagePath, file);

			if (uploadError) throw uploadError;

			// GET PUBLIC URL

			const { data } = supabase.storage.from("audio").getPublicUrl(storagePath);

			// SAVE TO SANITY

			onChange(
				set({
					url: data.publicUrl,
					storage_path: storagePath,
					file_name: file.name,
					file_size: file.size,
				}),
			);

			resetInput();
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Kunde inte ladda upp ljudfilen.");
		} finally {
			setUploading(false);
		}
	};

	const handleRemove = async () => {
		setErrorMessage(null);

		if (!value?.storage_path) {
			onChange(unset());
			return;
		}

		try {
			const { error: removeError } = await supabase.storage.from("audio").remove([value.storage_path]);

			if (removeError) throw removeError;

			onChange(unset());
			resetInput();
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Kunde inte ta bort ljudfilen.");
			resetInput();
		}
	};

	// RENDER

	return (
		<Stack space={4}>
			<input
				ref={inputRef}
				type="file"
				accept="audio/mpeg"
				onChange={handleUpload}
				style={{ display: "none" }}
			/>

			<Flex gap={2}>
				<Button
					text={uploading ? "Laddar upp..." : "Ladda upp ljudfil"}
					mode="default"
					tone="primary"
					disabled={uploading}
					onClick={() => inputRef.current?.click()}
				/>

				{value?.url && (
					<Button
						text="Ta bort ljudfil"
						tone="critical"
						mode="ghost"
						disabled={uploading}
						onClick={handleRemove}
					/>
				)}
			</Flex>

			{uploading && <Text size={1}>Laddar upp ljudfil...</Text>}
			{errorMessage && (
				<Card padding={2} radius={2} border>
					<Text size={1}>{errorMessage}</Text>
				</Card>
			)}

			{value?.url && (
				<Card padding={3} radius={2} shadow={1} border>
					<Stack space={3}>
						<a href={value.url} target="_blank" rel="noreferrer">
							Lyssna på ljudfil
						</a>

						<audio controls preload="metadata">
							<source src={value.url} type="audio/mpeg" />
						</audio>

						{value.file_name && (
							<Text size={1} muted>
								{value.file_name}
							</Text>
						)}
					</Stack>
				</Card>
			)}
		</Stack>
	);
};

export default AudioUploadInput;
