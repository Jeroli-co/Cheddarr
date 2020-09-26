import React, { useEffect, useState } from "react";
import { useFriends } from "../modules/user/friends/hooks/useFriends";

const useMediaStatus = (userProvider, media) => {
  const { getMediaStatus } = useFriends();
  const [isMediaAvailable, setIsMediaAvailable] = useState(null);

  useEffect(() => {
    const handleStatusChange = (status) => setIsMediaAvailable(status);
    if (userProvider) {
      getMediaStatus(userProvider, media.id).then((s) => handleStatusChange(s));
    }
  }, [userProvider]);

  return isMediaAvailable;
};

export { useMediaStatus };
