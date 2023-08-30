import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import Swal from "sweetalert2";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Modal from "react-modal";

export default function RestaurantPicker() {
	const [folders, setFolders] = useState([]);
	Modal.setAppElement("#root");
	React.useEffect(() => {
		loadFolders();
	}, []);

	React.useEffect(() => {
		saveFolders();
	}, [folders]);
	function loadFolders() {
		const storedFolders = JSON.parse(localStorage.getItem("folders"));
		if (storedFolders == null) return;
		setFolders(storedFolders);
	}

	function saveFolders() {
		if (folders?.length)
			localStorage.setItem("folders", JSON.stringify(folders));
	}

	// Note
	// Folder handlers
	const toggleFolder = (folder) => {
		setFolders((prev) =>
			prev.map((f) =>
				f.name === folder.name ? { ...f, open: !f.open } : f
			)
		);
	};
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
	const pickRestaurants = () => {
		let boxHtml = "";
		folders.forEach((folder) => {
			boxHtml += `<div  class="form-check">
            <input style="margin: 5px" class="form-check-input" type="checkbox" checked="true" value="" id=${folder.name}>
            <label style="margin: 5px"  class="form-check-label" for="checkbox1">
                ${folder.name}
            </label>
        </div>
        `;
		});
		Swal.fire({
			html: boxHtml,
			focusConfirm: false,
			showCancelButton: true,
			cancelButtonText: "取消",
			confirmButtonText: "隨機抽取",
			preConfirm: () => {
				let selected = [];
				folders.forEach((folder) => {
					console.log(document.getElementById(folder.name).checked);
					if (document.getElementById(folder.name).checked) {
						selected = selected.concat(folder.restaurants);
					}
				});
				console.log(selected);
				const random = Math.floor(Math.random() * selected.length);

				Swal.fire({
					title: "抽中的是： " + selected[random],
					color: "#716add",
					background: "#fff url(/images/trees.png)",
					backdrop: `
                      rgba(0,0,123,0.4)
                      url("https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif")
                      left top
                      no-repeat
                    `,
				});
			},
		}).then((result) => {
			console.log(result);
		});
	};
	// Restaurant handlers

	//...other handlers

	return (
		<div className="container">
			<h1>口袋餐廳名冊</h1>
			<Button margin="12px" onClick={addFolder} variant="success">
				新增資料夾
			</Button>
			<Button
				margin="12px"
				style={{ float: "right" }}
				variant="info"
				onClick={pickRestaurants}
			>
				隨機挑選餐廳
			</Button>
			{folders.map((folder) => (
				<div key={folder.name}>
					<h2 className="mt-2" onClick={() => toggleFolder(folder)}>
						{folder.open ? "📁" : "📂"} {folder.name + " "}
						<Button
							style={{
								textAlign: "center",
								float: "right",
								width: "40px",
								height: "30px",
							}}
							onClick={() => renameFolder(folder)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								style={{ display: "block", margin: "auto" }}
								viewBox="0 0 64 64"
							>
								<path
									fill="orange"
									d="M19.174,52.915l-7.524,1.672c-1.629,0.362-3.083-1.091-2.721-2.721l1.672-7.524 c0.248-1.114,0.808-2.134,0.614-1.941l30.17-30.17c2.172-2.172,4.071-2.172,5.243-1l5.657,5.657c1.172,1.172,1.172,3.071-1,5.243 l-30.17,30.17C21.309,52.107,20.288,52.668,19.174,52.915z"
								></path>
								<ellipse
									cx="32"
									cy="61"
									opacity=".3"
									rx="19"
									ry="3"
								></ellipse>
								<path
									fill="#fd3c4f"
									d="M48.965,24.451l3.32-3.32c1.172-1.172,1.172-3.071,0-4.243l-5.657-5.657	c-1.172-1.172-3.071-1.172-4.243,0l-3.32,3.32L48.965,24.451z"
								></path>
								<path
									fill="#a7b3c7"
									d="M49.577,26.129l-2.414,2.414c-1.172,1.172-3.071,1.172-4.243,0l-7.998-7.998	c-1.172-1.172-1.172-3.071,0-4.243l2.414-2.414c1.172-1.172,3.071-1.172,4.243,0l7.998,7.998	C50.749,23.058,50.749,24.958,49.577,26.129z"
								></path>
								<path
									fill="#ffce29"
									d="M20.959,52.189l-9.874-9.185c-0.209,0.425-0.38,0.871-0.483,1.338l-1.672,7.524	c-0.362,1.629,1.091,3.083,2.721,2.721l7.524-1.672C19.809,52.774,20.407,52.521,20.959,52.189z"
								></path>
								<path
									fill="#9c34c2"
									d="M9.589,48.898l-0.66,2.968c-0.362,1.629,1.091,3.083,2.721,2.721l2.968-0.66L9.589,48.898z"
								></path>
								<path
									d="M52.286,16.888l-0.691-0.691c-1.04,0.145-2.045,0.599-2.845,1.399l-30.17,30.17 c-0.084,0.083-0.199,0.156-0.336,0.212h0.001c-0.025,0.01-0.05,0.021-0.074,0.03c-0.027,0.01-0.054,0.02-0.081,0.026l-4.407,0.979 c-2.423,0.538-4.026,2.753-3.892,5.154c0.505,0.383,1.161,0.575,1.86,0.419l7.525-1.672c1.114-0.248,2.134-0.808,2.941-1.614 l22.029-22.029c1.032,0.323,2.2,0.09,3.018-0.728l2.414-2.414c0.818-0.818,1.051-1.986,0.728-3.018l1.981-1.981 C53.457,19.959,53.457,18.059,52.286,16.888z"
									opacity=".15"
								></path>
								<path
									fill="#fff"
									d="M19.273,34.344c0.976,0.977,2.256,1.465,3.535,1.465c1.279,0,2.56-0.488,3.535-1.465 l19.578-19.579c0.799-0.799,1.253-1.804,1.397-2.843l-0.691-0.691c-1.172-1.172-3.071-1.172-4.243,0l-1.953,1.953 c-1.05-0.361-2.259-0.134-3.097,0.704l-2.414,2.414c-0.838,0.838-1.066,2.046-0.704,3.097L19.273,34.344 C19.273,34.344,19.273,34.344,19.273,34.344z"
									opacity=".3"
								></path>
								<line
									x1="41.079"
									x2="38.534"
									y1="17.461"
									y2="20.006"
									fill="none"
									stroke="#fff"
									stroke-linecap="round"
									stroke-miterlimit="10"
									stroke-width="3"
								></line>
							</svg>
						</Button>
						<Button
							style={{
								textAlign: "center",
								float: "right",
								width: "40px",
								height: "30px",
							}}
							onClick={() => addRestaurant(folder)}
						>
							<svg
								className="plus-icon"
								viewBox="0 0 16 16"
								style={{ display: "block", margin: "auto" }}
							>
								<path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 1 1 0-2h6V1a1 1 0 0 1 1-1z" />
							</svg>
						</Button>
					</h2>
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
											handleDeleteRestaurant(folder, r)
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
			))}
		</div>
	);
}
