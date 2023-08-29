import React, { useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";

const RestaurantPicker = () => {
	//...component code
	const [selectedRestaurant, setSelectedRestaurant] = useState("selected");
	const [restaurants, setRestaurants] = useState([]);
	// Load initial state
	React.useEffect(() => {
		loadRestaurants();
	}, []);

	React.useEffect(() => {
		saveRestaurants();
	}, [restaurants]);

	function loadRestaurants() {
		const storedRestaurants = JSON.parse(
			localStorage.getItem("restaurants")
		);
		if (storedRestaurants == null) return;
		setRestaurants(storedRestaurants);
	}

	function saveRestaurants() {
		if (restaurants?.length)
			localStorage.setItem("restaurants", JSON.stringify(restaurants));
	}

	const handleAddRestaurant = (e) => {
		e.preventDefault();
		const form = e.target;
		const input = form.restaurant;

		if (input.value.trim() === "") {
			return;
		}
		const newRestaurant = e.target.restaurant.value;
		setRestaurants((prevRestaurants) => {
			return [...prevRestaurants, newRestaurant];
		});
	};
	const handlePickRestaurant = () => {
		const random = Math.floor(Math.random() * restaurants.length);
		setSelectedRestaurant(restaurants[random]);
	};
	const handleDeleteRestaurant = (restaurant) => {
		setRestaurants((prev) => prev.filter((r) => r !== restaurant));
	};
	return (
		<div className="container mt-5">
			<h1>口袋餐廳名冊</h1>

			<Form onSubmit={handleAddRestaurant}>
				<Form.Control
					name="restaurant"
					placeholder="Add a restaurant"
				/>
				<Button variant="primary" type="submit">
					增加餐廳
				</Button>
			</Form>

			<Button variant="success" onClick={handlePickRestaurant}>
				挑選隨機餐廳
			</Button>

			<div className="mt-3">
				<strong>挑中:</strong> {selectedRestaurant}
			</div>

			<ListGroup>
				{restaurants.map((r) => (
					<ListGroup.Item
						key={r}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{r + " "}

						<Button
							style={{
								marginLeft: "auto",
								float: "right",
							}}
							onClick={() => handleDeleteRestaurant(r)}
							variant="danger"
						>
							刪除
						</Button>
					</ListGroup.Item>
				))}
			</ListGroup>
		</div>
	);
};

export default RestaurantPicker;
