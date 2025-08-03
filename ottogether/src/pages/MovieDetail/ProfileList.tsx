import S from './ProfileList.module.css';
import type { Tables } from '../../supabase/supabase.type';

type Profile = Tables<'profile'>;

type Props = {
    profiles: Profile[];
}

const ProfileList: React.FC<Props> = ({ profiles }) => {
    const limitedProfiles = profiles.slice(0, 4);

    return (
        <div className={S.profileContainer}>
            {limitedProfiles.map((profile) => (
                <div key={profile.user_id} className={S.profileItem}>
                    <img
                        className={S.profileImage}
                        src={profile.avatar_url || './beomTeacher.svg'}
                        alt={`Profile picture of user ${profile.user_id}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProfileList;