import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
} from "react";

interface LoginFormProps {
  username: string;
  password: string;
  loading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => Promise<void>;
}

type FormSubmitHandler = NonNullable<
  ComponentPropsWithoutRef<"form">["onSubmit"]
>;

export function LoginForm({
  username,
  password,
  loading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  const handleUsernameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    onUsernameChange(event.target.value);
  };

  const handlePasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    onPasswordChange(event.target.value);
  };

  const handleSubmit: FormSubmitHandler = (
    event
  ): void => {
    event.preventDefault();

    void onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label
          htmlFor="username"
          className="form-label"
        >
          Usuário
        </label>

        <input
          id="username"
          type="text"
          className="form-control"
          value={username}
          onChange={handleUsernameChange}
          disabled={loading}
          autoComplete="username"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="form-label"
        >
          Senha
        </label>

        <input
          id="password"
          type="password"
          className="form-control"
          value={password}
          onChange={handlePasswordChange}
          disabled={loading}
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
