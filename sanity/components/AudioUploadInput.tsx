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
	const input_ref = useRef<HTMLInputElement | null>(null);

	// HANDLERS

	const resetInput = () => {
		if (input_ref.current) input_ref.current.value = "";
	};

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (!file) return;

		// VALIDATION

		if (file.type !== "audio/mpeg") {
			alert("Only MP3 files are allowed.");
			return;
		}

		if (file.size > 50 * 1024 * 1024) {
			alert("File must be under 50 MB.");
			return;
		}

		try {
			setUploading(true);

			const file_extension = file.name.split(".").pop();

			if (!file_extension) {
				throw new Error("Invalid file extension.");
			}

			const storage_path = `${crypto.randomUUID()}.${file_extension}`;

			// UPLOAD

			const { error: upload_error } = await supabase.storage.from("audio").upload(storage_path, file);

			if (upload_error) {
				throw upload_error;
			}

			// GET PUBLIC URL

			const { data } = supabase.storage.from("audio").getPublicUrl(storage_path);

			// SAVE TO SANITY

			onChange(
				set({
					url: data.publicUrl,
					storage_path,
					file_name: file.name,
					file_size: file.size,
				}),
			);

			resetInput();
		} catch (error) {
			console.error(error);

			alert(error instanceof Error ? error.message : "Failed to upload audio.");
		} finally {
			setUploading(false);
		}
	};

	const handleRemove = async () => {
		if (!value?.storage_path) {
			onChange(unset());
			return;
		}

		try {
			const { error: remove_error } = await supabase.storage.from("audio").remove([value.storage_path]);

			if (remove_error) {
				throw remove_error;
			}

			onChange(unset());
			resetInput();
		} catch (error) {
			console.error(error);

			alert(error instanceof Error ? error.message : "Failed to delete audio.");
			resetInput();
		}
	};

	// RENDER

	return (
		<Stack space={4}>
			<input
				ref={input_ref}
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
					onClick={() => input_ref.current?.click()}
				/>

				{value?.url && (
					<Button text="Ta bort ljudfil" tone="critical" mode="ghost" onClick={handleRemove} />
				)}
			</Flex>

			{uploading && <Text size={1}>Laddar upp ljudfil...</Text>}

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
