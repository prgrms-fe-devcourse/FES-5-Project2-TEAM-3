import { useState } from "react";
import S from "./Settings.module.css";
import ProfileSettings from "./ProfileSettings";
import SystemSettings from "./SystemSettings";

interface UserType {
  id: string;
  email?: string;
}

interface ProfileType {
  nickname: string | null;
  bio: string | null;
  url: string | null;
  avatar_url: string | null;
  header_url: string | null;
}

interface Props {
  user: UserType | null;
  profile: ProfileType | null;
}

function Settings({ user, profile }: Props) {
  const [activeTab, setActiveTab] = useState<"profile" | "system">("profile");

  return (
    <div className={S["settings-page"]}>
      <h1>Settings</h1>
      <hr />
      <div className={S["tab-buttons"]}>
        <button
          className={activeTab === "profile" ? S.active : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={activeTab === "system" ? S.active : ""}
          onClick={() => setActiveTab("system")}
        >
          System
        </button>
      </div>

      <div className={S["settings-container"]}>
        {activeTab === "profile" ? (
          <ProfileSettings user={user} profile={profile} />
        ) : (
          <SystemSettings user={user} profile={profile} />
        )}
      </div>
    </div>
  );
}

export default Settings;
