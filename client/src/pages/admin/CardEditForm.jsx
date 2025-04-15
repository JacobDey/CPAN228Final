import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CardEditForm = ({ card, onCancel, onSave }) => {
    const [formData, setFormData] = useState({
        id: card.id || '',
        name: card.name || '',
        abilityText: card.abilityText || '',
        colour: card.colour || '',
        power: card.power || 0,
        image: card.image || '',
        imageData: null,
        imageType: card.imageType || '',
        abilities: card.abilities || []
    });
    const [previewImage, setPreviewImage] = useState(
        card.image ? `data:${card.imageType};base64,${card.image}` : null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAbilityModal, setShowAbilityModal] = useState(false);
    const [currentAbility, setCurrentAbility] = useState(null);
    const [currentAbilityIndex, setCurrentAbilityIndex] = useState(-1);

    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

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

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
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

                // Clear image error if it exists
                if (errors.imageData) {
                    setErrors(prev => ({
                        ...prev,
                        imageData: null
                    }));
                }
            };
            reader.readAsArrayBuffer(resized.blob);
        } catch (error) {
            console.error("Error resizing image:", error);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Card name is required";
        }

        if (!formData.colour) {
            newErrors.colour = "Card colour is required";
        }

        if (formData.power < 0) {
            newErrors.power = "Power must be at least 0";
        }

        if (formData.power > 99) {
            newErrors.power = "Power must be at most 99";
        }

        // Only validate image for new cards (when editing, the image might already exist on the server)
        if (!formData.id && !formData.imageData && !previewImage) {
            newErrors.imageData = "Card image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const cardData = {
                id: formData.id || null,
                name: formData.name,
                abilityText: formData.abilityText,
                colour: formData.colour,
                power: formData.power,
                imageType: formData.imageType,
                abilities: formData.abilities // Include abilities in the data
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

            // Handle validation errors from server
            if (err.response?.status === 400 && err.response?.data) {
                if (typeof err.response.data === 'object') {
                    setErrors(err.response.data);
                } else {
                    alert('Error saving card: ' + err.response.data);
                }
            } else {
                alert('Error saving card: ' + (err.response?.data?.message || err.message));
            }
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

    // Ability management functions
    const handleAddAbility = () => {
        setCurrentAbility({
            abilityType: "",
            params: {}
        });
        setCurrentAbilityIndex(-1);
        setShowAbilityModal(true);
    };

    const handleEditAbility = (index) => {
        setCurrentAbility({ ...formData.abilities[index] });
        setCurrentAbilityIndex(index);
        setShowAbilityModal(true);
    };

    const handleDeleteAbility = (index) => {
        const newAbilities = [...formData.abilities];
        newAbilities.splice(index, 1);

        // Update abilityText based on the new abilities
        const abilityText = generateAbilityText(newAbilities);

        setFormData(prev => ({
            ...prev,
            abilities: newAbilities,
            abilityText: abilityText
        }));
    };

    const handleSaveAbility = (ability) => {
        const newAbilities = [...formData.abilities];

        if (currentAbilityIndex === -1) {
            // Add new ability
            newAbilities.push(ability);
        } else {
            // Update existing ability
            newAbilities[currentAbilityIndex] = ability;
        }

        // Generate ability text based on structured abilities
        const abilityText = generateAbilityText(newAbilities);

        setFormData(prev => ({
            ...prev,
            abilities: newAbilities,
            abilityText: abilityText
        }));

        setShowAbilityModal(false);
    };

    const generateAbilityText = (abilities) => {
        if (!abilities || abilities.length === 0) return "";

        return abilities.map(ability => {
            const params = ability.params || {};

            switch (ability.abilityType) {
                case "ON_ENTER":
                    return generateOnEnterText(params);
                case "ON_DEATH":
                    return generateOnDeathText(params);
                case "ON_CARD_DESTROYED":
                    return generateOnCardDestroyedText(params);
                case "TURN_START":
                    return "Destroys itself at the beginning of your turn.";
                default:
                    return `${ability.abilityType} with ${Object.keys(params).length} parameters`;
            }
        }).join(" ");
    };

    const generateOnEnterText = (params) => {
        const effect = params.effect;

        if (effect === "DESTROY_CARD" || effect === "DESTROY_CARDS") {
            if (params.target === "OPPOSING_UNCOVERED_BLUE") {
                return "On enter, destroy opposing uncovered blue card.";
            } else if (params.target === "OPPOSING_UNCOVERED_CARD") {
                return "On enter, destroy the opposing uncovered card.";
            } else if (params.target === "ALL_UNCOVERED_CARDS") {
                return "On enter, destroy every uncovered card.";
            }
        } else if (effect === "DESTROY_SELF_IF_COLOR_HERE" && params.targetColor === "RED") {
            return "On enter, destroy itself if there is a red card here.";
        } else if (effect === "DESTROY_IF_COLOR" && params.target === "CARD_BELOW") {
            return `On enter, destroy the card it's covering if it is ${params.targetColor.toLowerCase()}.`;
        } else if (effect === "POWER_CHANGE") {
            const value = params.value;
            const target = params.target;

            if (target === "RED_CARDS_HERE" || target === "BLUE_CARDS_HERE") {
                const color = target.startsWith("RED") ? "red" : "blue";
                return `On enter, ${color} cards here get ${value > 0 ? '+' : ''}${value}.`;
            } else if (target === "YOUR_CARDS_HERE") {
                return `On enter, your cards here get ${value > 0 ? '+' : ''}${value}.`;
            } else if (target === "YOUR_CARDS_HERE_WITH_POWER_LESS_THAN") {
                return `On enter, your cards with power ${params.powerThreshold} or less here get ${value > 0 ? '+' : ''}${value}.`;
            }
        } else if (effect === "DRAW_CARDS") {
            const count = params.count;
            if (count === 1) {
                return "On enter, draw a card.";
            } else {
                return `On enter, draw ${count} cards.`;
            }
        } else if (effect === "MOVE_CARDS") {
            return `On enter, all cards here move ${params.direction.toLowerCase()} ${params.distance}.`;
        } else if (effect === "MOVE_CARD" && params.destination === "TOWER_WITH_FEWEST_CARDS") {
            return "On enter, move opposing uncovered card here to the tower with the fewest cards.";
        } else if (effect === "OPPONENT_DISCARD") {
            return "On enter, opponent discards a random card.";
        } else if (effect === "SWAP_CONTROL") {
            return "On enter, swap control of every card on the board, including this card.";
        }

        return `On enter effect: ${effect}`;
    };

    const generateOnDeathText = (params) => {
        const effect = params.effect;
        const value = params.value;
        const target = params.target;

        if (effect === "POWER_CHANGE") {
            if (target === "RED_CARDS_HERE" || target === "BLUE_CARDS_HERE") {
                const color = target.startsWith("RED") ? "red" : "blue";
                return `On death, ${color} cards here get ${value > 0 ? '+' : ''}${value}.`;
            }
        }

        return `On death effect: ${effect}`;
    };

    const generateOnCardDestroyedText = (params) => {
        const effect = params.effect;

        if (effect === "DESTROY_SELF") {
            return "When a card is destroyed, this card destroys itself.";
        } else if (effect === "POWER_CHANGE" && params.target === "SELF") {
            return `When a card is destroyed, this card gets ${params.value > 0 ? '+' : ''}${params.value}`;
        }

        return `When a card is destroyed: ${effect}`;
    };

    // Get ability type options
    const abilityTypeOptions = [
        { value: "ON_ENTER", label: "On Enter" },
        { value: "ON_DEATH", label: "On Death" },
        { value: "ON_CARD_DESTROYED", label: "On Card Destroyed" },
        { value: "TURN_START", label: "Turn Start" }
    ];

    // Get effect options based on ability type
    const getEffectOptions = (abilityType) => {
        switch (abilityType) {
            case "ON_ENTER":
                return [
                    { value: "DESTROY_CARD", label: "Destroy Card" },
                    { value: "DESTROY_CARDS", label: "Destroy Cards" },
                    { value: "DESTROY_SELF_IF_COLOR_HERE", label: "Destroy Self If Color Here" },
                    { value: "DESTROY_IF_COLOR", label: "Destroy If Color" },
                    { value: "POWER_CHANGE", label: "Power Change" },
                    { value: "DRAW_CARDS", label: "Draw Cards" },
                    { value: "MOVE_CARDS", label: "Move Cards" },
                    { value: "MOVE_CARD", label: "Move Card" },
                    { value: "OPPONENT_DISCARD", label: "Opponent Discard" },
                    { value: "SWAP_CONTROL", label: "Swap Control" }
                ];
            case "ON_DEATH":
                return [
                    { value: "POWER_CHANGE", label: "Power Change" }
                ];
            case "ON_CARD_DESTROYED":
                return [
                    { value: "DESTROY_SELF", label: "Destroy Self" },
                    { value: "POWER_CHANGE", label: "Power Change" }
                ];
            case "TURN_START":
                return [
                    { value: "DESTROY_SELF_IF_OWNERS_TURN", label: "Destroy Self If Owner's Turn" }
                ];
            default:
                return [];
        }
    };

    // Get target options based on effect
    const getTargetOptions = (effect) => {
        switch (effect) {
            case "DESTROY_CARD":
                return [
                    { value: "OPPOSING_UNCOVERED_BLUE", label: "Opposing Uncovered Blue Card" },
                    { value: "OPPOSING_UNCOVERED_CARD", label: "Opposing Uncovered Card" }
                ];
            case "DESTROY_CARDS":
                return [
                    { value: "ALL_UNCOVERED_CARDS", label: "All Uncovered Cards" }
                ];
            case "DESTROY_IF_COLOR":
                return [
                    { value: "CARD_BELOW", label: "Card Below" }
                ];
            case "POWER_CHANGE":
                return [
                    { value: "RED_CARDS_HERE", label: "Red Cards Here" },
                    { value: "BLUE_CARDS_HERE", label: "Blue Cards Here" },
                    { value: "YOUR_CARDS_HERE", label: "Your Cards Here" },
                    { value: "YOUR_CARDS_HERE_WITH_POWER_LESS_THAN", label: "Your Cards Here With Power Less Than" },
                    { value: "SELF", label: "Self" }
                ];
            case "MOVE_CARDS":
                return [
                    { value: "ALL_CARDS_HERE", label: "All Cards Here" }
                ];
            case "MOVE_CARD":
                return [
                    { value: "OPPOSING_UNCOVERED_CARD", label: "Opposing Uncovered Card" }
                ];
            default:
                return [];
        }
    };

    // AbilityModal component
    const AbilityModal = ({ show, onClose, ability, onSave }) => {
        const [localAbility, setLocalAbility] = useState(ability || { abilityType: "", params: {} });

        useEffect(() => {
            setLocalAbility(ability || { abilityType: "", params: {} });
        }, [ability]);

        if (!show) return null;

        const handleAbilityTypeChange = (e) => {
            const newType = e.target.value;
            setLocalAbility({
                abilityType: newType,
                params: {}
            });
        };

        const handleEffectChange = (e) => {
            const newEffect = e.target.value;
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, effect: newEffect }
            }));
        };

        const handleTargetChange = (e) => {
            const newTarget = e.target.value;
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, target: newTarget }
            }));
        };

        const handleValueChange = (e) => {
            const value = parseInt(e.target.value);
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, value }
            }));
        };

        const handleCountChange = (e) => {
            const count = parseInt(e.target.value);
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, count }
            }));
        };

        const handleDirectionChange = (e) => {
            const direction = e.target.value;
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, direction }
            }));
        };

        const handleDistanceChange = (e) => {
            const distance = parseInt(e.target.value);
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, distance }
            }));
        };

        const handleDestinationChange = (e) => {
            const destination = e.target.value;
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, destination }
            }));
        };

        const handleTargetColorChange = (e) => {
            const targetColor = e.target.value;
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, targetColor }
            }));
        };

        const handleRandomChange = (e) => {
            const random = e.target.checked;
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, random }
            }));
        };

        const handlePowerThresholdChange = (e) => {
            const powerThreshold = parseInt(e.target.value);
            setLocalAbility(prev => ({
                ...prev,
                params: { ...prev.params, powerThreshold }
            }));
        };

        const handleSaveClick = () => {
            onSave(localAbility);
        };

        const renderEffectParams = () => {
            const effect = localAbility.params.effect;

            if (!effect) return null;

            const params = [];

            // Add target field for effects that need it
            if (["DESTROY_CARD", "DESTROY_CARDS", "POWER_CHANGE", "MOVE_CARDS", "MOVE_CARD", "DESTROY_IF_COLOR"].includes(effect)) {
                const targetOptions = getTargetOptions(effect);

                if (targetOptions.length > 0) {
                    params.push(
                        <div key="target" className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Target</label>
                            <select
                                value={localAbility.params.target || ""}
                                onChange={handleTargetChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select a target</option>
                                {targetOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }
            }

            // Add value field for POWER_CHANGE
            if (effect === "POWER_CHANGE") {
                params.push(
                    <div key="value" className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Value</label>
                        <input
                            type="number"
                            value={localAbility.params.value || 0}
                            onChange={handleValueChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                );

                // Add power threshold for specific targets
                if (localAbility.params.target === "YOUR_CARDS_HERE_WITH_POWER_LESS_THAN") {
                    params.push(
                        <div key="powerThreshold" className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Power Threshold</label>
                            <input
                                type="number"
                                value={localAbility.params.powerThreshold || 0}
                                onChange={handlePowerThresholdChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    );
                }
            }

            // Add card count for DRAW_CARDS
            if (effect === "DRAW_CARDS" || effect === "OPPONENT_DISCARD") {
                params.push(
                    <div key="count" className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Card Count</label>
                        <input
                            type="number"
                            value={localAbility.params.count || 1}
                            onChange={handleCountChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            min="1"
                        />
                    </div>
                );

                if (effect === "OPPONENT_DISCARD") {
                    params.push(
                        <div key="random" className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={!!localAbility.params.random}
                                    onChange={handleRandomChange}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">Random</span>
                            </label>
                        </div>
                    );
                }
            }

            // Add direction and distance for MOVE_CARDS
            if (effect === "MOVE_CARDS") {
                params.push(
                    <div key="direction" className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Direction</label>
                        <select
                            value={localAbility.params.direction || ""}
                            onChange={handleDirectionChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select a direction</option>
                            <option value="LEFT">Left</option>
                            <option value="RIGHT">Right</option>
                        </select>
                    </div>
                );

                params.push(
                    <div key="distance" className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Distance</label>
                        <input
                            type="number"
                            value={localAbility.params.distance || 1}
                            onChange={handleDistanceChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            min="1"
                        />
                    </div>
                );
            }

            // Add destination for MOVE_CARD
            if (effect === "MOVE_CARD") {
                params.push(
                    <div key="destination" className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Destination</label>
                        <select
                            value={localAbility.params.destination || ""}
                            onChange={handleDestinationChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select a destination</option>
                            <option value="TOWER_WITH_FEWEST_CARDS">Tower with Fewest Cards</option>
                        </select>
                    </div>
                );
            }

            // Add target color for color-specific effects
            if (effect === "DESTROY_SELF_IF_COLOR_HERE" || effect === "DESTROY_IF_COLOR") {
                params.push(
                    <div key="targetColor" className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Target Color</label>
                        <select
                            value={localAbility.params.targetColor || ""}
                            onChange={handleTargetColorChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select a color</option>
                            <option value="RED">Red</option>
                            <option value="BLUE">Blue</option>
                            <option value="GREEN">Green</option>
                            <option value="YELLOW">Yellow</option>
                            <option value="PURPLE">Purple</option>
                            <option value="ORANGE">Orange</option>
                            <option value="WHITE">White</option>
                        </select>
                    </div>
                );
            }

            return params;
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">
                        {currentAbilityIndex === -1 ? 'Add Ability' : 'Edit Ability'}
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Ability Type</label>
                        <select
                            value={localAbility.abilityType}
                            onChange={handleAbilityTypeChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select an ability type</option>
                            {abilityTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {localAbility.abilityType && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Effect</label>
                            <select
                                value={localAbility.params.effect || ""}
                                onChange={handleEffectChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select an effect</option>
                                {getEffectOptions(localAbility.abilityType).map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {localAbility.params.effect && renderEffectParams()}

                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveClick}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            disabled={!localAbility.abilityType || !localAbility.params.effect}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
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
                            className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Color</label>
                        <select
                            name="colour"
                            value={formData.colour}
                            onChange={handleChange}
                            className={`mt-1 block w-full border ${errors.colour ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
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
                        {errors.colour && <p className="text-red-500 text-xs mt-1">{errors.colour}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Ability Text</label>
                        <textarea
                            name="abilityText"
                            value={formData.abilityText}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder="Ability text will be automatically generated based on card abilities"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Power</label>
                        <input
                            type="number"
                            name="power"
                            value={formData.power}
                            onChange={handleChange}
                            className={`mt-1 block w-full border ${errors.power ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                            required
                            min="0"
                            max="99"
                        />
                        {errors.power && <p className="text-red-500 text-xs mt-1">{errors.power}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Card Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={`mt-1 block w-full ${errors.imageData ? 'text-red-500' : ''}`}
                        />
                        {errors.imageData && <p className="text-red-500 text-xs mt-1">{errors.imageData}</p>}
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

                {/* Card Abilities Section */}
                <div className="mt-6 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">Card Abilities</h3>
                        <button
                            type="button"
                            onClick={handleAddAbility}
                            className="btn btn-dark"
                        >
                            Add Ability
                        </button>
                    </div>

                    {formData.abilities.length === 0 ? (
                        <p className="text-gray-500 italic">No abilities defined for this card.</p>
                    ) : (
                        <ul className="border rounded-md divide-y">
                            {formData.abilities.map((ability, index) => (
                                <li key={index} className="p-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{ability.abilityType}</p>
                                        <p className="text-sm text-gray-600">
                                            {ability.params.effect}{' '}
                                            {ability.params.target && `(Target: ${ability.params.target})`}
                                            {ability.params.value !== undefined && ` Value: ${ability.params.value}`}
                                            {ability.params.count && ` Count: ${ability.params.count}`}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEditAbility(index)}
                                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAbility(index)}
                                            className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-danger"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Card'}
                    </button>
                </div>
            </form>

            {/* Ability Modal */}
            <AbilityModal
                show={showAbilityModal}
                onClose={() => setShowAbilityModal(false)}
                ability={currentAbility}
                onSave={handleSaveAbility}
            />
        </div>
    );
};

export default CardEditForm;