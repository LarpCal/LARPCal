import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    details1: React.CSSProperties;
    details2: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    details1?: React.CSSProperties;
    details2?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    details1: true;
    details2: true;
  }
}
