import React, { Component } from "react";
import CurrencyInput from "react-currency-masked-input";
import ReactDOM from "react-dom";
import axios from "axios";
import { Table } from "react-bootstrap";

class Lote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loteRows: [],
      document: {},
      tr_servico: this.props.tr_servico,
      responsavel_pesquisa: this.props.responsavel_pesquisa,
    };
    this.addLote = this.addLote.bind(this);
    this.showRows = this.showRows.bind(this);
    this.removeLote = this.removeLote.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  componentDidMount() {
  }

  handleAdditionPRP (dadosprp) {
    const dataprp = [].concat(this.state.dataprp, dadosprp)
    this.setState({ dataprp })
  }

  getSugestionsPRP(route) {
    return axios.get(route)
                .then(response => this.setPRP(response))
                .catch(error => { console.error(error)});
  }

  setSubacao(response) {
      const data = response.data;
      if(data !== null){
          const subacoes = data.map((value, index) => ({ id: value.id, name: value.codigo }));
          this.setState({ subacoes_suggestions: subacoes });
      }
  }

  loadSubacoes() {
      if(this.props.data.id_sub_acao !== undefined){
          let subacoes = [{id: 0, name: this.props.data.id_sub_acao}];
          try{
              subacoes = JSON.parse(this.props.data.id_sub_acao);
          }catch(err) {
              console.log(err);
          }
          this.setState({ subacoes });
      }
  }

  addItem(index, data) {
    var itemRows = this.state.itemRows;
    itemRows.push(
      <ItemRow
        key={index}
        parentMethod={this.removeItem}
        loteIndex={this.props.loteIndex}
        itemIndex={index}
        data={data}
        tr_servico={this.props.tr_servico}
        responsavel_pesquisa={this.props.responsavel_pesquisa}
      />
    );
    // itemRows.push({});
    this.setState({ itemRows: itemRows });
  }

  showRows() {
    let lotes = [];
    if (this.state.loteRows.length > 0) {
      this.state.loteRows.map((r, key) => {
        lotes.push(r);
      });
    }
    return lotes;
  }

  addLote(index = null, data) {
    var loteRows = this.state.loteRows;
    const lote = (
      <LoteBase
        tr_servico={this.props.tr_servico}
        responsavel_pesquisa={this.props.responsavel_pesquisa}
        loteIndex={index}
        value={index + 1}
        key={index}
        data={data}
        removeLote={this.removeLote.bind(this)}
      />
    );
    loteRows.push(lote);
    this.setState({ loteRows: loteRows });
  }

  insertItem(index, data) {
    var loteRows = this.state.loteRows;
    //const pedidosPrp = this.state.pedidosPrp === undefined ? [] : this.state.pedidosPrp;
    // console.log("console log 2---", $('#sigmdados').val());
    //   axios
    //   .get("/pedido-prp-sigm/" + $('#sigmdados').val())
    //   .then((response) => {
    //     this.setState({pedidosPrp: response.data});
    //     //console.log(this.state.pedidosPrp);
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });
    const lote = (
      <LoteBasePRP
        tr_servico={this.props.tr_servico}
        responsavel_pesquisa={this.props.responsavel_pesquisa}
        loteIndex={index}
        value={index + 1}
        key={index}
        data={data}
        removeLote={this.removeLote.bind(this)}
      >
        <ItemPRP>
          <ItemRowPRP
            key={index}
            parentMethod={this.removeItem}
            loteIndex={this.props.loteIndex}
            itemIndex={index}
            data={data}
            tr_servico={this.props.tr_servico}
            responsavel_pesquisa={this.props.responsavel_pesquisa}
          ></ItemRowPRP>
        </ItemPRP>
      </LoteBasePRP>
    );
    loteRows.push(lote);
    this.setState({ loteRows: loteRows });
  }

  removeLote(itemChild) {
    var loteRows = this.state.loteRows;

    if (loteRows.length >= 1) {
      const itemPosition = loteRows.indexOf(itemChild);

      loteRows.splice(itemPosition, 1);
      this.setState({ loteRows: loteRows });
    }
  }

  render() {

    const pedidosPrp = this.state.pedidosPrp === undefined ? [] : this.state.pedidosPrp;
    {console.log("console log no cadastrar lotes", pedidosPrp[0])}
    return (
      <div className="form-group" id="lote">
        {" "}
        {/* style="margin-bottom: 10px" */}
        <div id="lotes" className="col-md-12">
          <h4>Cadastrar Lotes</h4>
          <fieldset className={ this.state.responsavel_pesquisa == true ? "hide" : "show" }>
            Para adicionar lotes é necessário fornecer as informações sobre o
            lote, os itens e logo após inserir as etapas de execução para o
            mesmo.

          <tr id="dadosSigm">  
            <td className="col-md-auto">
              <input 
                type="text" 
                id="sigmdados" 
                className="form-control" 
                placeholder="Código de Registro de Preço" 
                value={pedidosPrp.id_processo} 
                />
            </td>
          </tr>

            <button className="btn btn-success pull-right" onClick={() => this.addLote(this.state.loteRows.length, {})} type="button">
              Adicionar Lote
            </button>
            
              <div id="lotes" className="col-md-12" style={{ paddingTop: "9px", paddingLeft: "731px", paddingBottom: "2px", }}>
                {/* <form>
                  <div id="autocomplete">
                  <input className="form-control" id="sigmdados" type="text" placeholder="Buscar" value={value} onChange={this.handleChange} required />
                  </div>
                </form> */}
                <button className="btn btn-success pull-right" onClick={() => { this.insertItem(this.state.loteRows.length, {}) }}>
                  Adicionar Registro de Preço
                </button>
              </div>
            {/* ADICIONAR EVENTO DE CLICK DO BOTAO PARA APARECER O COMPONENTE  */}
          </fieldset>
          {this.showRows()}
        </div>
      </div>
    );
  }
}

class LoteBasePRP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loteRows: [],
      numeroLote:
        this.props.data.numero_lote !== undefined
          ? this.props.data.numero_lote
          : this.props.value,
      descricao: this.props.data.descricao,
      amostra: this.props.data.amostra,
      prazo_entrega: this.props.data.prazo_entrega,
      tr_servico: this.props.tr_servico,
      responsavel_pesquisa: this.props.responsavel_pesquisa,
      children: this.props.children,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    axios
    .get("/pedido-prp-sigm/" + $("#sigmdados").val())
    .then((response) => {
      this.setState({pedidosPrp: response.data});
      //console.log(this.state.pedidosPrp);
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  handleChange(e) {
    let change = {};
    change[e.target.id] = e.target.value;
    this.setState(change);
  }

  

  render() {

    const pedidosPrp = this.state.pedidosPrp === undefined ? [] :  this.state.pedidosPrp;
    {console.log("console log em numero do lote", pedidosPrp[2])}
    return (
      <fieldset id="base-lote">
        {" "}
        {/* className="esconder" */}
        <table className="table lotes">
          <thead>
            <tr>
              <th className="col-md-auto">Nº Lote</th>
              <th className="col-md-auto">Descrição</th>
              <th
                className="col-md-auto "
                hidden={this.state.tr_servico ? true : false}
              >
                Amostra
              </th>
              <th
                className="col-md-auto"
                hidden={this.state.tr_servico ? true : false}
              >
                Prazo Entrega Lote (dias úteis)
              </th>
              <th className="col-md-auto" />
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="col-md-auto">
                <input
                  className="form-control lote-1"
                  id="numeroLote"
                  type="text"
                  readOnly={true}
                  defaultValue={this.props.loteIndex + 1}
                  name={"lotes[" + this.props.loteIndex + "][numero_lote]"}
                />
              </td>

              <td className="col-md-auto">
                <textarea
                  id="descricao"
                  className="form-control"
                  type="text"
                  placeholder="Ex: Disputa exclusiva... do Art. 34 DA Lei 11.488/2007"
                  readOnly={
                    this.state.responsavel_pesquisa == true ? true : false
                  }
                  name={"lotes[" + this.props.loteIndex + "][descricao]"} 
                  value={this.state.descricao}
                  onChange={this.handleChange}
                ></textarea>
              </td>

              <td
                className="col-md-auto"
                hidden={this.state.tr_servico ? true : false}
              >
                <select
                  id="amostra"
                  className="form-control"
                  type="text"
                  readOnly={
                    this.state.responsavel_pesquisa == true ? true : false
                  }
                  placeholder="Selecione..."
                  name={"lotes[" + this.props.loteIndex + "][amostra]"}
                  value={this.state.amostra}
                  onChange={this.handleChange}
                >
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </td>

              <td
                className="col-md-auto"
                hidden={this.state.tr_servico ? true : false}
              >
                <input
                  required={!this.state.tr_servico ? true : false}
                  readOnly={
                    this.state.responsavel_pesquisa == true ? true : false
                  }
                  id="prazo_entrega"
                  className="form-control"
                  name={`lotes[${this.props.loteIndex}][prazo_entrega]`}
                  type="number"
                  value={this.state.prazo_entrega}
                  placeholder={"em dias úteis"}
                  min="0"
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <ItemPRP
          loteIndex={this.props.loteIndex}
          item={this.props.data.item}
          tr_servico={this.state.tr_servico}
          responsavel_pesquisa={this.props.responsavel_pesquisa}
        />
        <button
          className={
            "btn btn-danger pull-right " +
            (this.state.responsavel_pesquisa == true ? "hide" : "show")
          }
          type="button"
          onClick={this.props.removeLote}
        >
          Remover Lote
        </button>
      </fieldset>
    );
  }
}

class LoteBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loteRows: [],
      numeroLote:
        this.props.data.numero_lote !== undefined
          ? this.props.data.numero_lote
          : this.props.value,
      descricao: this.props.data.descricao,
      amostra: this.props.data.amostra,
      prazo_entrega: this.props.data.prazo_entrega,
      tr_servico: this.props.tr_servico,
      responsavel_pesquisa: this.props.responsavel_pesquisa,
      children: this.props.children,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let change = {};
    change[e.target.id] = e.target.value;
    this.setState(change);
  }

  render() {
    return (
      <fieldset id="base-lote">
        {" "}
        {/* className="esconder" */}
        <table className="table lotes">
          <thead>
            <tr>
              <th className="col-md-auto">Nº Lote</th>
              <th className="col-md-auto">Descrição</th>
              <th
                className="col-md-auto "
                hidden={this.state.tr_servico ? true : false}
              >
                Amostra
              </th>
              <th
                className="col-md-auto"
                hidden={this.state.tr_servico ? true : false}
              >
                Prazo Entrega Lote (dias úteis)
              </th>
              <th className="col-md-auto" />
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="col-md-auto">
                <input
                  className="form-control lote-1"
                  id="numeroLote"
                  type="text"
                  readOnly={true}
                  defaultValue={this.state.numeroLote}
                  name={"lotes[" + this.props.loteIndex + "][numero_lote]"}
                />
              </td>

              <td className="col-md-auto">
                <textarea
                  id="descricao"
                  className="form-control"
                  type="text"
                  placeholder="Ex: Disputa exclusiva... do Art. 34 DA Lei 11.488/2007"
                  readOnly={
                    this.state.responsavel_pesquisa == true ? true : false
                  }
                  name={"lotes[" + this.props.loteIndex + "][descricao]"}
                  defaultValue={this.state.descricao}
                  onChange={this.handleChange}
                ></textarea>
              </td>

              <td
                className="col-md-auto"
                hidden={this.state.tr_servico ? true : false}
              >
                <select
                  id="amostra"
                  className="form-control"
                  type="text"
                  readOnly={
                    this.state.responsavel_pesquisa == true ? true : false
                  }
                  placeholder="Selecione..."
                  name={"lotes[" + this.props.loteIndex + "][amostra]"}
                  value={this.state.amostra}
                  onChange={this.handleChange}
                >
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </td>

              <td
                className="col-md-auto"
                hidden={this.state.tr_servico ? true : false}
              >
                <input
                  required={!this.state.tr_servico ? true : false}
                  readOnly={
                    this.state.responsavel_pesquisa == true ? true : false
                  }
                  id="prazo_entrega"
                  className="form-control"
                  name={`lotes[${this.props.loteIndex}][prazo_entrega]`}
                  type="number"
                  value={this.state.prazo_entrega}
                  placeholder={"em dias úteis"}
                  min="0"
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Item
          loteIndex={this.props.loteIndex}
          item={this.props.data.item}
          tr_servico={this.state.tr_servico}
          responsavel_pesquisa={this.props.responsavel_pesquisa}
        />
        <button
          className={
            "btn btn-danger pull-right " +
            (this.state.responsavel_pesquisa == true ? "hide" : "show")
          }
          type="button"
          onClick={this.props.removeLote}
        >
          Remover Lote
        </button>
      </fieldset>
    );
  }
}
class ItemPRP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemRows: [],
      responsavel_pesquisa: this.props.responsavel_pesquisa,
      children: this.props.children,
    };
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    if (this.props.item !== undefined) {
      this.props.item.map((item, key) => {
        this.addItem(key, item);
      });
    }
    this.addItem(this.state.itemRows.length, {});
  }

  loadRows() {
    return [
      this.state.itemRows
        ? this.state.itemRows.map((item, key) => {
            return item;
          })
        : "Adicione itens",
    ];
  }

  addItem(index, data) {
    // e.preventDefault();
    var itemRows = this.state.itemRows;
    // const index = itemRows.length;
    itemRows.push(
      <ItemRowPRP
        key={index}
        parentMethod={this.removeItem}
        loteIndex={this.props.loteIndex}
        itemIndex={index}
        data={data}
        tr_servico={this.props.tr_servico}
        responsavel_pesquisa={this.props.responsavel_pesquisa}
      />
    );
    // itemRows.push({});
    this.setState({ itemRows: itemRows });
  }

  removeItem(itemChild) {
    var itemRows = this.state.itemRows;
    if (itemRows.length >= 1) {
      const itemPosition = itemRows.indexOf(itemChild);
      itemRows.splice(itemPosition, 1);
      this.setState({ itemRows: itemRows });
    }
  }

  render() {
    return (
      <div>
        <fieldset>
          <h5>
            <strong>Cadastrar Itens:</strong>
          </h5>
          <table className="table">
            <thead>
              <tr>
                <th className="col-md-auto">Itens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="12">
                  <button
                    id="addItem"
                    className={
                      "btn btn-secondary pull-right " +
                      (this.state.responsavel_pesquisa == true
                        ? "hide"
                        : "show")
                    }
                    onClick={() => {
                        this.addItem(this.state.itemRows.length, {});
                    }
                    
                    }
                  >
                    +
                  </button>
                </td>
              </tr>
              {this.state.itemRows ? this.loadRows() : null}
            </tbody>
          </table>
        </fieldset>
      </div>
    );
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemRows: [],
      responsavel_pesquisa: this.props.responsavel_pesquisa,
      children: this.props.children,
    };
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    // if (this.props.item !== undefined) {
    //   this.props.item.map((item, key) => {
    //     this.addItem(key, item);
    //   });
    // }
    //this.addItem(this.state.itemRows.length, {}); //AQUI Ó
  }

  loadRows() {
    return [
      this.state.itemRows
        ? this.state.itemRows.map((item, key) => {
            return item;
          })
        : "Adicione itens",
    ];
  }

  addItem(index, data) {
    // e.preventDefault();
    var itemRows = this.state.itemRows;
    // const index = itemRows.length;
    itemRows.push(
      <ItemRow
        key={index}
        parentMethod={this.removeItem}
        loteIndex={this.props.loteIndex}
        itemIndex={index}
        data={data}
        tr_servico={this.props.tr_servico}
        responsavel_pesquisa={this.props.responsavel_pesquisa}
      />
    );
    // itemRows.push({});
    this.setState({ itemRows: itemRows });
  }

  removeItem(itemChild) {
    var itemRows = this.state.itemRows;
    if (itemRows.length >= 1) {
      const itemPosition = itemRows.indexOf(itemChild);
      itemRows.splice(itemPosition, 1);
      this.setState({ itemRows: itemRows });
    }
  }

  render() {
    return (
      <div>
        <fieldset>
          <h5>
            <strong>Cadastrar Itens:</strong>
          </h5>
          <table className="table">
            <thead>
              <tr>
                <th className="col-md-auto">Item</th>
                <th className="col-md-auto">Código SIGM</th>
                <th className="col-md-auto">Especificação</th>
                <th className="col-md-auto">QTD</th>
                <th className="col-md-auto">Unid</th>
                <th className="col-md-auto">Valor Unitário</th>
                <th className="col-md-auto">Valor Total</th>
                <th className="col-md-auto">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="12">
                  <button
                    id="addItem"
                    className={
                      "btn btn-secondary pull-right " +
                      (this.state.responsavel_pesquisa == true
                        ? "hide"
                        : "show")
                    }
                    onClick={() => {
                        this.addItem(this.state.itemRows.length, {});
                    }
                    
                    }
                  >
                    +
                  </button>
                </td>
              </tr>
              {this.state.itemRows ? this.loadRows() : null}
            </tbody>
          </table>
        </fieldset>
      </div>
    );
  }
}

class ItemRow extends Item {
  constructor(props) {
    super(props);
    this.state = {
      itemIndex: this.props.itemIndex + 1,
      etapasNumber: 1,
      dataSteps: [],
      especificacao: "",
      etapas: this.props.data.etapa,
      valorUnitario: this.props.data.valorund ? this.props.data.valorund : 0,
      qtd: this.props.data.qtd ? this.props.data.qtd : 0,
      valorTotal: this.props.data.valortotal
        ? parseFloat(
            this.props.data.valortotal.replace("R$ ", "").replace(",", ".")
          )
        : 0,
      numeroSiag: this.props.data.numero_siag,
      responsavel_pesquisa: this.props.responsavel_pesquisa,
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.generateDataSteps = this.generateDataSteps.bind(this);
    // this.showSteps = this.showSteps.bind(this);
    this.updateQtd = this.updateQtd.bind(this);
    this.updateValorUnitario = this.updateValorUnitario.bind(this);
    this.changeNumeroSiag = this.changeNumeroSiag.bind(this);
  }

  componentDidMount() {
    var tr_servico = this.props.tr_servico;
    $(document).on("keydown.autocomplete", "#siag", function () {
      $(this).autocomplete({
        source: "/busca-itens/" + tr_servico,
        select: function (event, ui) {
          let codProduto = ui.item.value;
          $(this).val(codProduto);
          name = $(this).attr("name");
          var name2 = $(this).attr("name");

          name = name.replace("numero_siag", "especificacao");
          name2 = name2.replace("numero_siag", "unid");
          $("input[name='" + name + "']").val(ui.item.descricao);
          $("input[name='" + name2 + "']").val(ui.item.un_medida);
          // $("input[name='numero_siag']").val(codProduto);
          // let elem = document.querySelector(this);
          event = {
            target: {
              value: codProduto,
            },
          };
          $(this).change(event);
        },
      });
    });
  }

  /*   componentWillUnmount() {
          // $("#siag").autocomplete('destroy');
      } */

  updateIndex(e) {
    this.setState({ itemIndex: parseInt(e.target.value) });
  }

  updateInputValue(e) {
    this.setState({ etapasNumber: parseInt(e.target.value) });
  }

  removeItem(e) {
    e.preventDefault();
    this.props.parentMethod(this);
  }

  updateQtd(e) {
    let name = e.target.name;
    name = name.replace("qtd", "numero_siag");
    var el = document.getElementsByName(name);
    if (isNaN(e.target.value)) {
      this.setState({ qtd: 0, numeroSiag: el[0].value });
    } else {
      this.setState({
        qtd: parseFloat(e.target.value),
        numeroSiag: el[0].value,
      });
      this.mutiplyValues();
    }
  }

  updateValorUnitario(e) {
    this.setState({ valorUnitario: e.target.value });
    this.state.valorUnitario = parseFloat(e.target.value);
    this.mutiplyValues();
  }

  mutiplyValues() {
    let qtd = this.state.qtd;
    let valorUnitario = this.state.valorUnitario;

    if (isNaN(valorUnitario) || valorUnitario === "") {
      valorUnitario = 0;
    }
    let total = valorUnitario * qtd;
    this.setState({ valorTotal: total });
  }

  changeNumeroSiag(e) {
    this.setState({ numeroSiag: e.target.value });
  }

  generateDataSteps() {
    const etapas = this.state.etapasNumber;
    let etapasExecucaoObj = [];
    for (let i = 0; i < etapas; i++) {
      //add nº etapa;mutiplyValues
      //modificar nome da variável etapas
      etapasExecucaoObj.push({});
    }
    this.setState({ etapas: etapasExecucaoObj });
  }

  // showSteps() {
  //     return (
  //         <EtapaExecucao
  //             etapas={this.state.etapas}
  //             loteIndex={this.props.loteIndex}
  //             itemIndex={this.props.itemIndex}
  //         />
  //     );
  // }

  render() {
    return (
      <React.Fragment>
        <tr>
          <td className="col-md-auto">
            <input
              type="text"
              className="form-control"
              name={
                "lotes[" +
                this.props.loteIndex +
                "][item][" +
                this.props.itemIndex +
                "][numero]"
              }
              defaultValue={this.state.itemIndex}
              readOnly={true}
              onChange={this.updateIndex}
            />
          </td>
          <td className="col-md-auto">
            <input
              type="text"
              id="siag"
              className="form-control"
              readOnly={this.state.responsavel_pesquisa == true ? true : false}
              placeholder="Código"
              name={
                "lotes[" +
                this.props.loteIndex +
                "][item][" +
                this.props.itemIndex +
                "][numero_siag]"
              }
              value={this.state.numeroSiag}
              onChange={this.changeNumeroSiag}
            />
          </td>
          <td className="col-md-auto">
            <input
              type="text"
              id="especificacao"
              className="form-control"
              placeholder="Especificação"
              name={
                "lotes[" +
                this.props.loteIndex +
                "][item][" +
                this.props.itemIndex +
                "][especificacao]"
              }
              defaultValue={this.props.data.especificacao}
              readOnly={true}
            />
          </td>
          <td className="col-md-auto">
            <input
              type="text"
              className="form-control"
              placeholder="QTD"
              readOnly={this.state.responsavel_pesquisa == true ? true : false}
              name={
                "lotes[" +
                this.props.loteIndex +
                "][item][" +
                this.props.itemIndex +
                "][qtd]"
              }
              value={this.state.qtd}
              onChange={this.updateQtd}
              onKeyUp={this.updateQtd}
            />
          </td>
          <td className="col-md-auto">
            <input
              type="text"
              id="unidade"
              className="form-control"
              placeholder="UM"
              name={
                "lotes[" +
                this.props.loteIndex +
                "][item][" +
                this.props.itemIndex +
                "][unid]"
              }
              defaultValue={this.props.data.unid}
              readOnly={true}
            />
          </td>
          <td className="col-md-auto">
            <CurrencyInput
              className="form-control"
              placeholder="Valor Unitário"
              readOnly={this.state.responsavel_pesquisa == true ? false : true}
              name={
                "lotes[" +
                this.props.loteIndex +
                "][item][" +
                this.props.itemIndex +
                "][valorund]"
              }
              defaultValue={
                this.state.valorUnitario != 0 ? this.state.valorUnitario : ""
              }
              onKeyUp={this.updateValorUnitario}
            />
          </td>
          <td className="col-md-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Valor Total"
              name={
                "lotes[" +
                this.props.loteIndex +
                "][item][" +
                this.props.itemIndex +
                "][valortotal]"
              }
              value={"R$ " + this.state.valorTotal.toFixed(2).replace(".", ",")}
              readOnly={true}
            />
          </td>
          <td colSpan="2" className="col-md-auto">
            {/* <button
                            className="btn btn-secondary pull-left"
                            onClick={this.generateDataSteps}
                            type="button"
                        >
                            <span className="glyphicon glyphicon-refresh" />
                        </button> */}
            <button
              id="removeItem"
              className={
                "btn btn-danger pull-right " +
                (this.state.responsavel_pesquisa == true ? "hide" : "show")
              }
              onClick={this.removeItem}
            >
              -
            </button>
          </td>
        </tr>
        {/* <tr>
                    <td colSpan="12">{this.showSteps()}</td>
                </tr> */}
      </React.Fragment>
    );
  }
}

class ItemRowPRP extends ItemPRP {
  constructor(props) {
    super(props);
    this.state = {
      itemIndex: this.props.itemIndex + 1,
      etapasNumber: 1,
      dataSteps: [],
      dados_sigm: [],
      especificacao: this.props.data.descricao_item,
      etapas: this.props.data.etapa,
      valorUnitario: this.props.data.vl_unit_estimado ? this.props.data.vl_unit_estimado : 0,
      quantidade: this.props.data.quantidade ? this.props.data.quantidade : 0,
      valorTotal: this.props.data.vl_total_estimado
        ? parseFloat(
            this.props.data.vl_total_estimado.replace("R$ ", "").replace(",", ".")
          )
        : 0,
      codigoItem: this.props.data.codigo_item,
      unidade: this.props.data.unidade,
      responsavel_pesquisa: this.props.responsavel_pesquisa,
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.generateDataSteps = this.generateDataSteps.bind(this);
    // this.showSteps = this.showSteps.bind(this);
    this.updateQtd = this.updateQtd.bind(this);
    this.updateValorUnitario = this.updateValorUnitario.bind(this);
    this.changeNumeroSiag = this.changeNumeroSiag.bind(this);
    //this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    axios
    .get("/pedido-prp-sigm/" + $("#sigmdados").val())
    .then((response) => {
      this.setState({pedidosPrp: response.data});
      //console.log(this.state.pedidosPrp);
    })
    .catch(function (error) {
      console.error(error);
    });
  }

  updateIndex(e) {
    this.setState({ itemIndex: parseInt(e.target.value) });
  }

  updateInputValue(e) {
    this.setState({ etapasNumber: parseInt(e.target.value) });
  }

  removeItem(e) {
    e.preventDefault();
    this.props.parentMethod(this);
  }

  updateQtd(e) {
    let name = e.target.name;
    name = name.replace("quantidade", "codigo_item");
    var el = document.getElementsByName(name);
    if (isNaN(e.target.value)) {
      this.setState({ quantidade: 0, codigo_item: el[0].value });
    } else {
      this.setState({
        quantidade: parseFloat(e.target.value),
        codigo_item: el[0].value,
      });
      this.mutiplyValues();
    }
  }

  updateValorUnitario(e) {
    this.setState({ vl_unit_estimado: e.target.value });
    this.state.vl_unit_estimado = parseFloat(e.target.value);
    this.mutiplyValues();
  }

  mutiplyValues() {
    let quantidade = this.state.quantidade;
    let vl_unit_estimado = this.state.vl_unit_estimado;

    if (isNaN(vl_unit_estimado) || vl_unit_estimado === "") {
      vl_unit_estimado = 0;
    }
    let total = vl_unit_estimado * quantidade;
    this.setState({ vl_total_estimado: total });
  }

  changeNumeroSiag(e) {
    this.setState({ codigoItem: e.target.value });
  }

  generateDataSteps() {
    const etapas = this.state.etapasNumber;
    let etapasExecucaoObj = [];
    for (let i = 0; i < etapas; i++) {
      //add nº etapa;mutiplyValues
      //modificar nome da variável etapas
      etapasExecucaoObj.push({});
    }
    this.setState({ etapas: etapasExecucaoObj });
  }

  // showSteps() {
  //     return (
  //         <EtapaExecucao
  //             etapas={this.state.etapas}
  //             loteIndex={this.props.loteIndex}
  //             itemIndex={this.props.itemIndex}
  //         />
  //     );
  // }




  render() {

    const pedidosPrp = this.state.pedidosPrp === undefined ? [] :  this.state.pedidosPrp;

    {console.log(pedidosPrp)}

    return (
      <React.Fragment>
            <tr id="dadosSigm">
              <td className="col-md-auto">
                <div>
                      <thead>
                          <tr>
                              <th>Lote</th>
                              <th>Código SIGM</th>
                              <th>Descrição</th>
                              <th>Quantidade</th>
                              <th>Unidade</th>
                              <th>Valor unitário</th>
                              <th>Valor total</th>
                          </tr>
                      </thead>
                    
                  {pedidosPrp.map((pedido) => {
                    const valor_unit = pedido.vl_unit_estimado;
                    const vl_unit_estim = Number(valor_unit).toFixed(2);
                    const valor_total = pedido.vl_total_estimado;
                    const vl_total_estim = Number(valor_total).toFixed(2);
                    return <tr key={pedido.id_processo}>
                        <td>{pedido.lote}</td>
                        <td>{pedido.codigo_item}</td>
                        <td>{pedido.descricao_item}</td>
                        <td>{pedido.quantidade}</td>
                        <td>{pedido.unidade}</td>
                        <td>R${vl_unit_estim.replace(".", ",")}</td>
                        <td>R${vl_total_estim.replace(".", ",")}</td>
                      </tr>
                  })}
                </div>
                {/* <input
                  type="text"
                  className="form-control"
                  name={
                    "lotes[" +
                    this.props.loteIndex +
                    "][item][" +
                    this.props.itemIndex +
                    "][numero]"
                  }
                  defaultValue={this.state.dados_sigm}
                  readOnly={true}
                  onChange={this.updateIndex}
                /> */}
              </td>
            </tr>
          {/* <tr>
                      <td colSpan="12">{this.showSteps()}</td>
                  </tr> */}
      </React.Fragment>
    );
  }
}

class EtapaExecucao extends React.Component {
  constructor(props) {
    super(props);
    this.state = { etapasRows: [] };
    this.showSteps = this.addLote = this.showSteps.bind(this);
  }

  showSteps() {
    const etapas = this.props.etapas;
    let etapaRows = this.state.etapasRows;
    const loteIndex = this.props.loteIndex;
    const itemIndex = this.props.itemIndex;

    //print loteIndex, itemIndex

    if (etapas !== undefined) {
      etapaRows = [];
      etapas.map(function (etapa, key) {
        const etapaIndex = key;
        etapaRows.push(
          <EtapaRow
            numero_etapa={etapa.numero_etapa}
            descricao={etapa.descricao}
            valor={etapa.valor}
            porcentagem={etapa.porcentagem}
            prazo={etapa.prazo}
            id_item={etapa.id_item}
            loteIndex={loteIndex}
            itemIndex={itemIndex}
            etapaIndex={etapaIndex}
          />
        );
      });
    }

    return etapaRows;
  }

  render() {
    return (
      <fieldset>
        <h5>
          <strong>Etapa(s) de Execução:</strong>
        </h5>
        <table className="table etapas" id="etapa">
          <thead>
            <tr>
              <th className="col-md-2">Nº Etapa</th>
              <th className="col-md-4">Item</th>
              <th className="col-md-1">Porcentagem (%)</th>
              <th className="col-md-2">Valor</th>
              <th className="col-md-2">Prazo</th>
              <th className="col-md-1" />
            </tr>
          </thead>
          <tbody>{this.showSteps()}</tbody>
        </table>
      </fieldset>
    );
  }
}

class EtapaRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numero_etapa: this.props.numero_etapa,
      descricao: this.props.descricao,
      porcentagem: this.props.porcentagem,
      valor: this.props.valor,
      prazo: this.props.prazo,
      id_item: this.props.id_item,
    };
  }

  render() {
    return (
      <tr id="base-etapa">
        {/*
                    this.props.numero_etapa,
                    this.props.descricao,
                    this.props.valor,
                    this.props.loteIndex,
                    this.props.itemIndex,
                    this.props.etapaIndex
                )} */}
        <td className="col-md-2">
          {/* <input className="form-control" type="text" name={'etapa['+ 0 +'][etapa_numero]'} value={this.props.numero_etapa} /> */}
          <input
            className="form-control"
            type="text"
            name={
              "lotes[" +
              this.props.loteIndex +
              "][item][" +
              this.props.itemIndex +
              "][etapa][" +
              this.props.etapaIndex +
              "][numero_etapa]"
            }
            value={this.state.numero_etapa}
          />
        </td>
        <td className="col-md-4">
          <input
            className="form-control"
            type="text"
            name={`lotes[${this.props.loteIndex}][item][${this.props.itemIndex}][etapa][${this.props.etapaIndex}][descricao]`}
            value={this.state.descricao}
          />
        </td>
        <td className="col-md-1">
          <input
            className="form-control"
            type="text"
            placeholder="%"
            name={`lotes[${this.props.loteIndex}][item][${this.props.itemIndex}][etapa][${this.props.etapaIndex}][porcentagem]`}
            value={this.state.porcentagem}
          />
        </td>
        <td className="col-md-2">
          <input
            className="form-control"
            type="text"
            placeholder="Valor"
            name={`lotes[${this.props.loteIndex}][item][${this.props.itemIndex}][etapa][${this.props.etapaIndex}][valor]`}
            value={this.state.valor}
          />
        </td>
        <td className="col-md-3">
          <input
            className="form-control"
            type="text"
            placeholder="Prazo"
            name={`lotes[${this.props.loteIndex}][item][${this.props.itemIndex}][etapa][${this.props.etapaIndex}][prazo]`}
            value={this.state.prazo}
          />
        </td>
        <input
          type="hidden"
          name={`lotes[${this.props.loteIndex}][item][${this.props.itemIndex}][etapa][${this.props.etapaIndex}][id_item]`}
          value={this.state.id_item}
        />
      </tr>
    );
  }
}

// if(document.getElementById('lotes-itens')) {
//     ReactDOM.render(<Lote />, document.getElementById("lotes-itens"));
// }

export default Lote;
