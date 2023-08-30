import { useState } from "react";
import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import Swal from "sweetalert2";
export default function RestaurantPicker() {
	const [folders, setFolders] = useState([
		{
			name: "速食",
			restaurants: ["KFC", "McDonald's"],
			open: true,
		},
	]);

	const [selectedRestaurant, setSelectedRestaurant] = useState("");
	// Note
	// Folder handlers
	const addFolder = () => {
		Swal.fire({
			title: "增加資料夾",
			input: "text",
			inputLabel: "資料夾名稱",
			inputValue: "",
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return "資料夾名稱不能是空白的";
				} else if (folders.some((e) => e.name === value)) {
					return "此資料夾已經存在了";
				}
			},
		}).then((result) => {
			let name = result.value;
			if (name)
				setFolders((prev) => [
					...prev,
					{
						name,
						restaurants: [],
						open: true,
					},
				]);
		});
	};

	const toggleFolder = (folder) => {
		setFolders((prev) =>
			prev.map((f) =>
				f.name === folder.name ? { ...f, open: !f.open } : f
			)
		);
	};

	const renameFolder = (folder) => {
		Swal.fire({
			title: "更改資料夾名稱",
			input: "text",
			inputLabel: "資料夾名稱",
			inputValue: folder.name,
			showCancelButton: true,
			denyButtonText: `刪除`,
			showDenyButton: true,
		}).then((result) => {
			let name = result.value;
			if (result.isDenied) {
				setFolders((prev) =>
					prev.filter((f) => f.name !== folder.name)
				);
			} else if (name) {
				setFolders((prev) =>
					prev.map((f) =>
						f.name === folder.name ? { ...f, name } : f
					)
				);
			}
		});
	};

	const addRestaurant = (folder) => {
		Swal.fire({
			title: "增加餐廳",
			input: "text",
			inputLabel: "餐廳名稱",
			inputValue: "",
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return "餐廳名稱不能是空白的";
				} else if (folder.restaurants.indexOf(value) !== -1) {
					return "此餐廳已經在這個資料夾裡了";
				}
			},
		}).then((result) => {
			let name = result.value;
			if (name) {
				setFolders((prev) =>
					prev.map((f) =>
						f.name === folder.name
							? { ...f, restaurants: f.restaurants.concat(name) }
							: f
					)
				);
			}
		});
	};
	const handleDeleteRestaurant = (folder, restaurant) => {
		setFolders((prev) =>
			prev.map((f) =>
				f.name === folder.name
					? {
							...f,
							restaurants: f.restaurants.filter(
								(r) => r !== restaurant
							),
					  }
					: f
			)
		);
	};
	// Restaurant handlers

	//...other handlers

	return (
		<div className="container">
			<Button onClick={addFolder}>Add Folder</Button>

			{folders.map((folder) => (
				<div key={folder.name}>
					<div className="row">
						<div
							className="col-md-6"
							onClick={() => toggleFolder(folder)}
						>
							<h2>
								{folder.open ? "📁" : "📂"} {folder.name + " "}
							</h2>
						</div>
						<div className="col col-lg-2">
							<Button
								style={{
									float: "right",
									width: "50px",
									height: "40px",
								}}
								onClick={() => renameFolder(folder)}
							>
								✏️
							</Button>
							<Button
								className="col-ml-6-float-right"
								style={{
									float: "right",
									width: "50px",
									height: "40px",
								}}
								onClick={() => addRestaurant(folder)}
							>
								<svg className="plus-icon" viewBox="0 0 16 16">
									<path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 1 1 0-2h6V1a1 1 0 0 1 1-1z" />
								</svg>
							</Button>
						</div>
					</div>
					<div className="row">
						<div className="col-ml-8">
							{folder.open || (
								<ListGroup>
									{folder.restaurants.map((r) => (
										<ListGroupItem
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											{r + "  "}
											<Button
												style={{
													marginLeft: "auto",
													float: "right",
												}}
												onClick={() =>
													handleDeleteRestaurant(
														folder,
														r
													)
												}
												variant="danger"
											>
												刪除
											</Button>
										</ListGroupItem>
									))}
								</ListGroup>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
