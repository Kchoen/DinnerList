function Folder({ folder }) {
	return (
		<div>
			{folder.name}

			<button onClick={() => openSettings(folder)}>Settings</button>
		</div>
	);

	function openSettings(folder) {
		// open modal/popup to add restaurant
	}
}
