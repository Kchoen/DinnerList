import { Modal } from "react-bootstrap";
import { useState } from "react";
export default function CustomPrompt({ title, buttons }) {
	const [show, setShow] = useState(false);

	return (
		<Modal show={show} onHide={() => setShow(false)}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{buttons.map((btn) => (
					<Button onClick={() => onClick(btn)}>{btn.label}</Button>
				))}
			</Modal.Body>
		</Modal>
	);

	function onClick(btn) {
		setShow(false);
		// return result
	}
}
