import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { create } from 'ipfs-http-client';
import { v4 } from 'uuid';
const useMilestone = () => {
  const [milestones, setMilestones] = useState([
    { image: '', description: '', milestoneId: '', path: '', atachments: [] },
  ]);

  const handleAddMilestone = () => {
    // setMilestones({ ...newMilestones, newMilestone });
  };

  const [fileUri, setFileUri] = useState([]);

  const { uploadFile, getFile } = useAuth();

  const auth =
    'Basic ' +
    Buffer.from(
      process.env.NEXT_PUBLIC_IPFS_API_KEY +
        ':' +
        process.env.NEXT_PUBLIC_IPFS_KEY_SECRET
    ).toString('base64');

  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  const handleImageUpload = async (index) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const result = await ipfs.add(file);
          const ipfsHash = result.path;
          const urlImage = `https://ipfs.io/ipfs/${ipfsHash}`;

          setFileUri((prevFileUri) => {
            const newFileUri = [...prevFileUri];
            newFileUri[index] = urlImage;
            return newFileUri;
          });

          setMilestones((prevMilestones) => {
            const newMilestones = [...prevMilestones];
            newMilestones[index].image = urlImage;
            return newMilestones;
          });

          console.log(milestones);
        }
      };

      input.click();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const handleFileUpload = async (index) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const extension = file.name.split('.').pop();
          const uniqueId = v4().substr(0, 8);
          const randomName = `${uniqueId}.${extension}`;

          const result = await ipfs.add(file);
          const ipfsHash = result.path;
          const urlFile = `https://ipfs.io/ipfs/${ipfsHash}`;

          setMilestones((prevMilestones) => {
            const newMilestones = prevMilestones.map((milestone, i) => {
              if (i === index) {
                const atachments = [
                  ...milestone.atachments,
                  { name: randomName, url: urlFile },
                ];
                return { ...milestone, atachments };
              }
              return milestone;
            });
            return newMilestones;
          });

          console.log(milestones);
        }
      };

      input.click();
    } catch (error) {
      console.error('Error al subir el archivo', error);
    }
  };

  return {
    setFileUri,
    fileUri,
    milestones,
    setMilestones,
    handleImageUpload,
    handleAddMilestone,
    handleFileUpload,
  };

  return {
    setFileUri,
    fileUri,
    milestones,
    setMilestones,
    handleImageUpload,
    handleAddMilestone,
    handleFileUpload,
  };
};

export default useMilestone;
