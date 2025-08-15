import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useTranslation } from "react-i18next";
import countryData from "../assets/contrycode.json";

interface CountryOption {
  name: string;
  dial_code: string;
  code: string;
}

interface CountryCodeSelectProps {
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  disabled: boolean;
  sx?: SxProps<Theme>;
}

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  countryCode,
  onCountryCodeChange,
  disabled,
  sx,
}) => {
  const { t } = useTranslation();

  return (
    <Autocomplete
      options={countryData}
      disabled={disabled}
      getOptionLabel={(option: CountryOption) =>
        `${option.name} (${option.dial_code})`
      }
      value={
        countryData.find((country) => country.dial_code === countryCode) || null
      }
      onChange={(event, newValue: CountryOption | null) => {
        onCountryCodeChange(newValue ? newValue.dial_code : "");
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("authPage.countryCodeLabel")}
          placeholder={t("authPage.countryCodePlaceHolder")}
          variant="outlined"
          disabled={disabled}
          sx={sx}
        />
      )}
      sx={{ width: "70%" }}
      disablePortal
    />
  );
};

export default CountryCodeSelect;
