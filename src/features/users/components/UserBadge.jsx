import { Stack } from 'react-bootstrap';
import { useGetProfileQuery } from '../store/users.slice';
import Avatar from './Avatar';

export default function UserBadge({
  userId,
  size = 28,
  showName = true,
  rounded = true,
  className = 'align-items-center',
}) {
  const { firstName = 'Unknown', lastName = 'User', imageUrl, isLoading } = useGetProfileQuery(userId, {
    selectFromResult: ({ data, isLoading }) => ({
      isLoading,
      firstName: data?.profile?.firstName,
      lastName: data?.profile?.lastName,
      imageUrl: data?.profile?.profileImageUrl,
    }),
  });

  return (
    <Stack direction="horizontal" gap={1} className={className}>
      <Avatar size={size} firstName={firstName} lastName={lastName} imageUrl={imageUrl} rounded={rounded} showTooltip={false} />
      {showName && (
        <span className="text-sm text-truncate fw-semibold">
          {isLoading ? '...' : `${firstName} ${lastName}`.trim()}
        </span>
      )}
    </Stack>
  );
}
