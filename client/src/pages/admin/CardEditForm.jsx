import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CardEditForm = ({ card, onCancel, onSave }) => {
    const [formData, setFormData] = useState({
        id: card.id || '',
        name: card.name || '',
        description: card.description || '',
        colour: card.colour || '',
        power: card.power || 0,
        image: card.image || '',
        imageData: null,
        imageType: card.imageType || ''
    });
    const [previewImage, setPreviewImage] = useState(
        card.image ? `data:${card.imageType};base64,${card.image}` : null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const SERVER_URL = 'http://localhost:8080';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(`${SERVER_URL}/admin/test`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } catch (err) {
                alert("You don't have permission");
                navigate('/');
            }
        };

        checkAuth();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
          // Resize the image
          const resized = await resizeImage(file);
          
          // Convert blob to array for storage
          const reader = new FileReader();
          reader.onloadend = () => {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            setFormData(prev => ({
              ...prev,
              imageType: file.type,
              imageData: Array.from(uint8Array)
            }));
            setPreviewImage(URL.createObjectURL(resized.blob));
          };
          reader.readAsArrayBuffer(resized.blob);
        } catch (error) {
          console.error("Error resizing image:", error);
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            const cardData = {
                id: formData.id || null,
                name: formData.name,
                description: formData.description,
                colour: formData.colour,
                power: formData.power,
                imageType: formData.imageType
            };
    
            // Create FormData object
            const formDataToSend = new FormData();
            formDataToSend.append('card', new Blob([JSON.stringify(cardData)], {
                type: 'application/json'
            }));
    
            // Only append image if it exists
            if (formData.imageData) {
                const blob = new Blob([new Uint8Array(formData.imageData)], { 
                    type: formData.imageType 
                });
                formDataToSend.append('image', blob, 'card-image');
            }
    
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
    
            const endpoint = formData.id 
                ? `${SERVER_URL}/admin/editCard` 
                : `${SERVER_URL}/admin/addCard`;
    
            await axios[formData.id ? 'put' : 'post'](endpoint, formDataToSend, config);
            onSave();
        } catch (err) {
            console.error("Error saving card:", err);
            alert('Error saving card: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const resizeImage = (file, maxWidth = 325, maxHeight = 180) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              // Calculate new dimensions while maintaining aspect ratio
              let width = img.width;
              let height = img.height;
              
              if (width > height) {
                if (width > maxWidth) {
                  height = Math.round(height * (maxWidth / width));
                  width = maxWidth;
                }
              } else {
                if (height > maxHeight) {
                  width = Math.round(width * (maxHeight / height));
                  height = maxHeight;
                }
              }
              
              // Create canvas and resize
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              // Convert to blob
              canvas.toBlob((blob) => {
                resolve({
                  blob,
                  type: file.type
                });
              }, file.type);
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
                {formData.id ? 'Edit Card' : 'Add New Card'}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Color</label>
                        <select
                            name="colour"
                            value={formData.colour}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        >
                            <option value="">Select a color</option>
                            <option value="Red">Red</option>
                            <option value="Blue">Blue</option>
                            <option value="Yellow">Yellow</option>
                            <option value="Green">Green</option>
                            <option value="Purple">Purple</option>
                            <option value="Orange">Orange</option>
                            <option value="White">White</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Power</label>
                        <input
                            type="number"
                            name="power"
                            value={formData.power}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Card Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full"
                        />
                    </div>
                </div>

                {previewImage && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Preview</label>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="mt-1 h-48 object-contain border rounded"
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Card'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CardEditForm;