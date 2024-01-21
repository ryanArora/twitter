import { UploadButton } from "./upload-button";

export default function ProfileSettingsPage() {
  return (
    <div>
      <UploadButton path="avatars">Upload Avatar</UploadButton>
      <UploadButton path="banners">Upload Banner</UploadButton>
    </div>
  );
}
