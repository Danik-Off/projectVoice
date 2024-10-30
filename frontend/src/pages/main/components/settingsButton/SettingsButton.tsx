import './SettingsButton.css'; // Assuming you have a separate CSS file for styling

const SettingsButton = () => {
    const handleClick = () => {
        // Logic to open settings
        alert("Open settings");
    };

    return (
        <button className="settings-button" onClick={handleClick}>
            ⚙️
        </button>
    );
};

export default SettingsButton;
