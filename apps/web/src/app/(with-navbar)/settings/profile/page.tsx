import { UploadButton } from "./upload-button";

export default function ProfileSettingsPage() {
  return (
    <div>
      <UploadButton resource="avatars">Upload Avatar</UploadButton>
      <UploadButton resource="banners">Upload Banner</UploadButton>
    </div>
  );
}
