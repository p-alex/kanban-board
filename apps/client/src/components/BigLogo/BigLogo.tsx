interface Props {
  showDarkThemeVersion: boolean;
}

function BigLogo(props: Props) {
  return (
    <>
      {props.showDarkThemeVersion ? (
        <img src="./logos/logo-light.svg" width={153} height={26} alt="" />
      ) : (
        <img src="./logos/logo-dark.svg" width={153} height={26} alt="" />
      )}
    </>
  );
}

export default BigLogo;
