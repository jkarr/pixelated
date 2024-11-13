function Field({ fieldName, label, fieldType = "text", fieldRequired = true, change }) {
    return (
        <div className="field" >
            <input type={fieldType} id={fieldName} name={fieldName} onChange={change} required={fieldRequired} />
            <label htmlFor={fieldName}>{label}</label>
        </div>
    )
}

export default Field;