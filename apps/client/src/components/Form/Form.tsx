import { FormHTMLAttributes } from "react";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

function Form({ title, description, children, ...formProps }: Props) {
  return (
    <form {...formProps} className="flex flex-col gap-6">
      {(title || description) && (
        <div className="text-(--text_lt) dark:text-(--text_dt)">
          {title && <h2 className="text-2xl font-semibold">{title}</h2>}
          {description && (
            <p className="text-(--text_muted_lt) dark:text-(--text_muted_dt)">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </form>
  );
}

export default Form;
