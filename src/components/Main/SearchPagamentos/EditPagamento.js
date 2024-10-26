import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./EditPagamento.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../utils/links";
import axios from "axios";
import question_icon from "../../../assets/images/question.png";

const EditPagamento = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const maquinaInfos = location.state;

  const { authInfo, setNotiMessage } = useContext(AuthContext);

  const [data, setData] = useState({
    nome: maquinaInfos?.nome ?? "",
    descricao: maquinaInfos?.descricao ?? "",
    estoque: Number(maquinaInfos?.estoque) ?? 0,
    store_id: Number(maquinaInfos?.storeId) ?? 0,
    maquininha_serial: String(maquinaInfos?.maquininha_serial),
    valorDoPulso: maquinaInfos?.pulso ?? 0,
  });
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

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

  const onSave = () => {
    // check require
    let errorsTemp = {};
    if (data.nome.trim() === "") {
      errorsTemp.nome = "Este campo é obrigatório";
    }
    if (data.descricao.trim() === "") {
      errorsTemp.descricao = "Este campo é obrigatório";
    }

    if (data.valorDoPulso < 0) {
      errorsTemp.valorDoPulso = "Este campo é obrigatório";
    }
    if (data.estoque < 0) {
      errorsTemp.estoque = "Estoque é obrigatório";
    }
    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/maquina-cliente`,
        {
          id,
          nome: data.nome,
          descricao: data.descricao,
          estoque: Number(data.estoque),
          store_id: String(data.store_id),
          maquininha_serial: String(data.maquininha_serial),
          valorDoPulso: data.valorDoPulso,
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
        navigate(links.DASHBOARD_FORNECEDOR);
      })
      .catch((err) => {
        setIsLoading(false);
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message:
              "A sua sessão expirou, para continuar faça login novamente.",
          });
        } else if (err.response.status === 400) {
          setNotiMessage({
            type: "error",
            message: `${err.response.data.error}`,
          });
          setErrors((prev) => ({
            ...prev,
            nome: "Já existe uma máquina com esse nome",
          }));
        } else {
          setNotiMessage({
            type: "error",
            message: "Um erro ocorreu",
          });
        }
      });
  };

  return (
    <div className="PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="PagamentosSearch_header">
        <div className="PagamentosSearch_header_left">
          <div className="Dashboard_staBlockTitle">Editar Máquina</div>
        </div>

        <Button
          className="EditPagamentos_header_back"
          onClick={() => {
            navigate(`${links.FORNECEDOR_SEARCH_CANAIS}/${id}`, {
              state: location.state,
            });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>

      <div className="Update_Pagamento_content">
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="nome">
            Nome:
          </label>
          <Input
            placeholder={"Máquina 1"}
            value={data.nome}
            id="nome"
            type="text"
            name="nome"
            autoComplete="nome"
            onChange={(event) => {
              handleChange("nome", event.target.value);
            }}
            className={`${!!errors.nome ? "Update_Pagamento_inputError" : ""}`}
          />
          {errors.nome && (
            <div className="Update_Pagamento_itemFieldError">{errors.nome}</div>
          )}
        </div>
        <div className="Update_Pagamento_itemField">
          <label
            className="Update_Pagamento_itemFieldLabel"
            htmlFor="descricao"
          >
            Descricão:
          </label>
          <Input
            placeholder={"Máquina da padaria de juquinha"}
            value={data.descricao}
            id="descricao"
            type="text"
            name="descricao"
            autoComplete="descricao"
            onChange={(event) => {
              handleChange("descricao", event.target.value);
            }}
            className={`${
              !!errors.descricao ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.descricao && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.descricao}
            </div>
          )}
        </div>

        <div className="Update_Pagamento_itemField">
          <label
            className="Update_Pagamento_itemFieldLabel"
            htmlFor="store_id"
            style={{ display: "flex", alignItems: "center" }}
          >
            <span>Store_id:</span>
            <Button
              className="EditPagamentos_header_HelpPage"
              onClick={() => {
                navigate(links.HELP_PAGE, {
                  state: {
                    ...location.state,
                    redirect_url: `${links.EDIT_FORNECEDOR_CANAIS}/${id}`,
                  },
                });
              }}
              disabled={isLoading}
            >
              <img
                className="Edit_Pagamento_Icon"
                src={question_icon}
                alt="question icon"
              />
            </Button>
          </label>
          <Input
            placeholder={"12345678"}
            value={data.store_id}
            id="store_id"
            name="store_id"
            min={0}
            autoComplete="store_id"
            onChange={(event) => {
              handleChange("store_id", event.target.value);
            }}
            className={`${
              !!errors.store_id ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.store_id && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.store_id}
            </div>
          )}
        </div>
        <div className="AddMachine_itemField">
          <label className="AddMachine_itemFieldLabel" htmlFor="maquininha_serial">
            Maquininha_serial:
          </label>
          <Input
            placeholder={""}
            value={data.maquininha_serial}
            id="maquininha_serial"
            name="maquininha_serial"
            min={0}
            autoComplete="maquininha_serial"
            onChange={(event) => {
              handleChange("maquininha_serial", event.target.value);
            }}
            className={`${!!errors.maquininha_serial ? "AddMachine_inputError" : ""}`}
          />
          {errors.maquininha_serial && (
            <div className="AddMachine_itemFieldError">{errors.maquininha_serial}</div>
          )}
        </div>
        <div className="Update_Pagamento_itemField">
          <label
            className="Update_Pagamento_itemFieldLabel"
            htmlFor="valorDoPulso"
          >
            Valor Do Pulso R$:
          </label>
          <Input
            placeholder={"1.50"}
            value={data.valorDoPulso}
            id="valorDoPulso"
            type="number"
            name="valorDoPulso"
            autoComplete="valorDoPulso"
            onChange={(event) => {
              handleChange("valorDoPulso", event.target.value);
            }}
            className={`${
              !!errors.valorDoPulso ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.valorDoPulso && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.valorDoPulso}
            </div>
          )}
        </div>
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="estoque">
            Estoque:
          </label>
          <Input
            placeholder={"1.50"}
            value={data.estoque}
            id="estoque"
            type="number"
            name="estoque"
            autoComplete="estoque"
            onChange={(event) => {
              handleChange("estoque", event.target.value);
            }}
            className={`${
              !!errors.estoque ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.estoque && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.estoque}
            </div>
          )}
        </div>
        <Button
          className="Update_Pagamento_saveBtn"
          onClick={() => {
            if (!isLoading) onSave();
          }}
          disabled={isLoading}
        >
          SALVAR ALTERAÇÕES
        </Button>
        <Button
          className="Update_Pagamento_deleteBtn"
          onClick={() => {
            navigate(`${links.DELETE_FORNECEDOR}/${id}`, {
              state: location.state,
            });
          }}
          disabled={isLoading}
        >
          EXCLUIR MÁQUINA
        </Button>
      </div>
    </div>
  );
};

export default EditPagamento;
