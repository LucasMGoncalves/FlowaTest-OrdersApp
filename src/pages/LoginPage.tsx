import { useState } from "react";
import axios from "axios";

import { LoginForm } from "../components/LoginForm";

import { login } from "../services/authService";

interface PageAlert {
  type: "success" | "danger";
  message: string;
}

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({
  onLoginSuccess,
}: LoginPageProps) {
  const [username, setUsername] =
    useState<string>("");

  const [password, setPassword] =
    useState<string>("");

  const [loading, setLoading] =
    useState<boolean>(false);

  const [alert, setAlert] =
    useState<PageAlert | null>(null);

  const handleUsernameChange = (
    value: string
  ): void => {
    setUsername(value);

    if (alert) {
      setAlert(null);
    }
  };

  const handlePasswordChange = (
    value: string
  ): void => {
    setPassword(value);

    if (alert) {
      setAlert(null);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setAlert(null);

    if (!username.trim()) {
      setAlert({
        type: "danger",
        message: "Usuário é obrigatório.",
      });

      return;
    }

    if (!password.trim()) {
      setAlert({
        type: "danger",
        message: "Senha é obrigatória.",
      });

      return;
    }

    try {
      setLoading(true);

      await login({
        username,
        password,
      });

      onLoginSuccess();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const responseData: unknown =
          error.response?.data;

        let message = "Erro ao realizar login.";

        if (
          typeof responseData === "string"
        ) {
          message = responseData;
        } else if (
          responseData &&
          typeof responseData === "object" &&
          "message" in responseData &&
          typeof responseData.message === "string"
        ) {
          message = responseData.message;
        } else if (error.message) {
          message = error.message;
        }

        setAlert({
          type: "danger",
          message,
        });

        return;
      }

      setAlert({
        type: "danger",
        message:
          "Erro inesperado ao realizar login.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <section className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h2 text-center mb-4">
                Teste Flowa | Login
              </h1>

              {alert && (
                <div
                  className={`alert alert-${alert.type}`}
                  role="alert"
                >
                  {alert.message}
                </div>
              )}

              <LoginForm
                username={username}
                password={password}
                loading={loading}
                onUsernameChange={
                  handleUsernameChange
                }
                onPasswordChange={
                  handlePasswordChange
                }
                onSubmit={handleSubmit}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
