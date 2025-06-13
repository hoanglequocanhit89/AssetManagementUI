export const formatNotificationTime = (createdAt: string | number | Date) => {
    const now = new Date();
    const createdDate = new Date(`${createdAt}`);

    createdDate.setHours(createdDate.getHours() + 7);

  const diffMs = now.getTime() - createdDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  if (diffDays <= 3) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
  
    return createdDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
};
  