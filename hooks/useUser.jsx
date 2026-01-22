import React, { useEffect, useState } from 'react';
import {
  getUserByUid,
  updateDescription,
  updateHistory,
  updateProfileImage,
  updateWallpaperImg,
} from '../firebase/controllers/firestoreControllers';
import { pinFileToIpfs } from '../utils/ipfs';

const useUser = (id) => {
  const [user, setUser] = useState();

  const fetchUser = async () => {
    try {
      const response = await getUserByUid(id);
      console.log(response);
      setUser(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEditImage = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const result = await pinFileToIpfs(file);
            const urlImage = result.url;
            setUser((prevUser) => ({
              ...prevUser,
              data: {
                ...prevUser.data,
                profileImg: urlImage,
              },
            }));

            await updateProfileImage(user.id, urlImage);
          } catch (error) {
            alert(error.message);
          }
        }
      };

      input.click();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const handleEditWallpaper = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const result = await pinFileToIpfs(file);
            const urlImage = result.url;
            setUser((prevUser) => ({
              ...prevUser,
              data: {
                ...prevUser.data,
                wallpaperImg: urlImage,
              },
            }));

            await updateWallpaperImg(user.id, urlImage);
          } catch (error) {
            alert(error.message);
          }
        }
      };

      input.click();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const handleSaveDescription = async (description) => {
    try {
      console.log(user.id);
      console.log(description);
      await updateDescription(user.id, description);
    } catch (error) {
      console.log(error);
    }

    setUser((prevUser) => ({
      data: {
        ...prevUser.data,
        description: description,
      },
    }));
  };
  const handleSaveHistory = async (history) => {
    try {
      console.log(user.id);
      console.log(history);
      await updateHistory(user.id, history);
    } catch (error) {
      console.log(error);
    }

    setUser((prevUser) => ({
      data: {
        ...prevUser.data,
        history: history,
      },
    }));
  };

  return {
    user,
    setUser,
    handleEditImage,
    handleSaveDescription,
    handleSaveHistory,
    handleEditWallpaper,
  };
};

export default useUser;
