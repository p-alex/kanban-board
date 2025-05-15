interface Props {
  redirectToElementWithClass: string;
}

function FocusTrap(props: Props) {
  const handleRedirect = () => {
    const element = document.querySelector(
      "." + props.redirectToElementWithClass
    ) as HTMLElement;
    element?.focus();
  };

  return <div tabIndex={0} onFocus={handleRedirect}></div>;
}

export default FocusTrap;
