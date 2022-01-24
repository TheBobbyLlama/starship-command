import "./CheckboxWidget.css";

function CheckboxWidget({ label, checked, clickHandler }) {
	return (
		<div className="checkboxWidget" onClick={clickHandler}>
			<div>{(checked) ? "x" : ""}</div>
			<label>{label}</label>
		</div>
	);
}

export default CheckboxWidget;