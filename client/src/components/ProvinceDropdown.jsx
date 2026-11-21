import { TextField, MenuItem } from "@mui/material";
import { useState } from "react";

const provinces = [
    { name: "Alberta", code: "AB" },
    { name: "British Columbia", code: "BC" },
    { name: "Manitoba", code: "MB" },
    { name: "New Brunswick", code: "NB" },
    { name: "Newfoundland and Labrador", code: "NL" },
    { name: "Northwest Territories", code: "NT" },
    { name: "Nova Scotia", code: "NS" },
    { name: "Nunavut", code: "NU" },
    { name: "Ontario", code: "ON" },
    { name: "Prince Edward Island", code: "PE" },
    { name: "Quebec", code: "QC" },
    { name: "Saskatchewan", code: "SK" },
    { name: "Yukon", code: "YT" },
];


const ProvinceDropdown = ({ value, onChange, required = false, name = "province" }) => {
    const [touched, setTouched] = useState(false);

    return (
        <TextField
            select
            fullWidth
            label="Province / Territory"
            value={value}
            onChange={onChange}
            required={required}
            name={name}
            onBlur={() => setTouched(true)}
            error={required && touched && !value}
            helperText={required && touched && !value ? "Province is required" : ""}
        >
            <MenuItem value="" disabled>
                Select a province or territory
            </MenuItem>

            {provinces.map((province) => (
                <MenuItem key={province.code} value={province.code}>
                    {province.name}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default ProvinceDropdown;