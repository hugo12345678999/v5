import React, { useContext, useState } from "react";
import { Button, Input, DatePicker, Tooltip } from "antd";
import "./AddCliente.css";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import * as links from "../../../../utils/links";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import question_icon from "../../../../assets/images/question.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const AddCliente = (props) => {
  const { authInfo, setDataUser, setNotiMessage } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authInfo?.dataUser?.token;

  const dateFormat = "YYYY-MM-DD";
  let currentDate = moment();

  const [data, setData] = useState({
    nome: "",
    email: "",
    senha: "",
    mercadoPagoToken: "",
    dataVencimento: currentDate.add(1, "years"),
    pagbankToken: "",
    pagbankEmail: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => {
      let errorsTemp = { ...prev };
      delete errorsTemp[name];
      return errorsTemp;
    });
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const onSave = () => {
    // check require
    let errorsTemp = {};
    if (data.nome.trim() === "") {
      errorsTemp.nome = "Este campo é obrigatório";
    }

    if (!validateEmail(data.email)) {
      errorsTemp.email = "Este campo é obrigatório";
    }
    if (data.senha.trim().length < 6) {
      errorsTemp.senha = "A senha deve possuir no mínimo 6 dígitos.";
    }

    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/cliente`,
        {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          mercadoPagoToken: data.mercadoPagoToken,
          dataVencimento: new Date(data.dataVencimento),
          pagbankToken: data.pagbankToken,
          pagbankEmail: data.pagbankEmail,
        },
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        navigate(links.DASHBOARD_CLIENTES);
      })
      .catch((err) => {
        setIsLoading(false);

        setNotiMessage({
          type: "error",
          message: err.response?.data?.error
            ? err.response?.data?.error
            : `A sua sessão expirou, para continuar faça login novamente.`,
        });
      });
  };

  const handleGeneratePassword = () => {
    handleChange("senha", String(Math.floor(100000 + Math.random() * 9000)));
  };

  return (
    <>
      {isLoading && <LoadingAction />}
      <div className="AddCliente_container">
        <div className="AddCliente_header">
          <div className="AddCliente_header_title">Cadastro de Cliente</div>
          <Link
            className="AddCliente_header_back"
            to={links.DASHBOARD_CLIENTES}
          >
            VOLTAR
          </Link>
        </div>
        <div className="AddCliente_content">
          <div className="AddCliente_itemField">
            <label className="AddCliente_itemFieldLabel" htmlFor="nome">
              Nome:
            </label>
            <Input
              placeholder={"Jukinha da Silva"}
              value={data.nome}
              id="nome"
              type="text"
              name="nome"
              autoComplete="nome"
              onChange={(event) => {
                handleChange("nome", event.target.value);
              }}
              className={`${!!errors.nome ? "AddCliente_inputError" : ""}`}
            />
            {errors.nome && (
              <div className="AddCliente_itemFieldError">{errors.nome}</div>
            )}
          </div>

          <div className="AddCliente_itemField">
            <label className="AddCliente_itemFieldLabel" htmlFor="email">
              Email:
            </label>
            <Input
              placeholder={"Jukinha@gmail.com"}
              value={data.email}
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              onChange={(event) => {
                handleChange("email", event.target.value);
              }}
              className={`${!!errors.email ? "AddCliente_inputError" : ""}`}
            />
            {errors.email && (
              <div className="AddCliente_itemFieldError">{errors.email}</div>
            )}
          </div>

          <div className="AddCliente_itemField">
            <div className="AddCliente_Label_Icon">
              <label
                className="AddCliente_itemFieldLabel"
                htmlFor="mercadoPagoToken"
              >
                Senha
              </label>
              {/* <div
                onClick={() => handleGeneratePassword()}
                className="AddCliente_Reload_Icon"
              >
                <img
                  src={reload_icon}
                  alt="reload icon"
                  className="AddCliente_Icon"
                />
              </div> */}
              <Button
                style={{ margin: "10px 15px" }}
                onClick={handleGeneratePassword}
              >
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  style={{ marginRight: "5px" }}
                />
                Gerar Senha
              </Button>
            </div>

            <Input
              placeholder={"********"}
              value={data.senha}
              id="senha"
              type="text"
              name="senha"
              autoComplete="senha"
              onChange={(event) => {
                handleChange("senha", event.target.value);
              }}
              className={`${!!errors.senha ? "AddCliente_inputError" : ""}`}
            />
            {errors.senha && (
              <div className="AddCliente_itemFieldError">{errors.senha}</div>
            )}
          </div>

          <div className="AddCliente_itemFieldMercadoPago">
            <div className="AddCliente_Label_Icon">
              <label
                className="AddCliente_itemFieldLabel"
                htmlFor="mercadoPagoToken"
              >
                Token Mercado Pago
              </label>
              <img
                src={question_icon}
                alt="question icon"
                className="AddCliente_Icon"
                onClick={() =>
                  navigate(links.TOKEN_HELP_PAGE, {
                    state: { redirect_url: `${links.ADD_CLIENTES}` },
                  })
                }
              />
            </div>

            <Input
              placeholder={"APPMP123123-12312-123123"}
              value={data.mercadoPagoToken}
              id="mercadoPagoToken"
              type="text"
              name="mercadoPagoToken"
              autoComplete="mercadoPagoToken"
              onChange={(event) => {
                handleChange("mercadoPagoToken", event.target.value);
              }}
              className={`${
                !!errors.mercadoPagoToken ? "AddCliente_inputError" : ""
              }`}
            />
            {errors.mercadoPagoToken && (
              <div className="AddCliente_itemFieldError">
                {errors.mercadoPagoToken}
              </div>
            )}
          </div>

          <div className="AddCliente_itemFieldPagbank">
            <div className="AddCliente_Label_Icon">
              <label className="AddCliente_itemFieldLabel" htmlFor="pagbankToken">
                Token Pagbank
              </label>
              <Tooltip title={
                <>
                  Acesse: <br />
                  https://pagseguro.uol.com.br/ <br />
                  Entrar <br />
                  Menu esquerdo (VENDAS) <br />
                  Role para baixo um pouco a tela, na opção: <br />
                  Plataformas e Checkout <br />
                  Clique em Integrações <br />
                  Clique no botão Gerar token
                </>
              }>
                <img
                  src={question_icon}
                  alt="question icon"
                  className="AddCliente_Icon"
                />
              </Tooltip>
            </div>
            <Input
              placeholder={"Token do PagBank"}
              value={data.pagbankToken}
              id="pagbankToken"
              type="text"
              name="pagbankToken"
              autoComplete="pagbankToken"
              onChange={(event) => {
                handleChange("pagbankToken", event.target.value);
              }}
              className={`${
                !!errors.pagbankToken ? "AddCliente_inputError" : ""
              }`}
            />
            {errors.pagbankToken && (
              <div className="AddCliente_itemFieldError">
                {errors.pagbankToken}
              </div>
            )}
          </div>

          <div className="AddCliente_itemFieldPagbank">
            <label className="AddCliente_itemFieldLabel" htmlFor="pagbankEmail">
              Email Pagbank
            </label>
            <Input
              placeholder={"email@pagbank.com"}
              value={data.pagbankEmail}
              id="pagbankEmail"
              type="email"
              name="pagbankEmail"
              autoComplete="pagbankEmail"
              onChange={(event) => {
                handleChange("pagbankEmail", event.target.value);
              }}
              className={`${
                !!errors.pagbankEmail ? "AddCliente_inputError" : ""
              }`}
            />
            {errors.pagbankEmail && (
              <div className="AddCliente_itemFieldError">
                {errors.pagbankEmail}
              </div>
            )}
          </div>
          <div className="AddCliente_itemField">
            <div className="AddCliente_Label_Icon">
              <label
                className="AddCliente_itemFieldLabel"
                htmlFor="mercadoPagoToken"
              >
                Data de Vencimento
              </label>
              <Tooltip title="A data de vencimento do cliente é uma data que após 10 dias é feito a trava das máquinas do cliente para receber pagamentos. Ideal para quem cobra mensalidade, se não definida por padrão colocamos 1 (um) ano. se não quiser usar coloque uma data maior">
                <img
                  src={question_icon}
                  alt="question icon"
                  className="AddCliente_Icon"
                />
              </Tooltip>
            </div>
            <DatePicker
              defaultValue={data.dataVencimento}
              format={dateFormat}
              id="dataVencimento"
              name="dataVencimento"
              autoComplete="dataVencimento"
              onChange={(vl, dateString) => {
                handleChange("dataVencimento", dateString);
              }}
              className={`${
                !!errors.dataVencimento ? "AddCliente_inputError" : ""
              }`}
            />
            {errors.dataVencimento && (
              <div className="AddCliente_itemFieldError">
                {errors.dataVencimento}
              </div>
            )}
          </div>

          <Button
            className="AddCliente_saveBtn"
            onClick={() => {
              if (!isLoading) onSave();
            }}
            disabled={isLoading}
          >
            SALVAR
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddCliente;
