const router = require("express").Router();

const Merchandise = require("@controller/Merchandise");
const Negotiation = require("@controller/Negotiation");
const Provider = require("@controller/Provider");
const Category = require("@controller/Category");
const Request = require("@controller/Request");
const Client = require("@controller/Client");
const Buyer = require("@controller/Buyer");
const Notice = require("@controller/Notice");
const User = require("@controller/User");




// Methods User
// getUsuarios.php
router.post("/getuser", User.getUser); // localhost:3001/getuser

// Methods Clients
router.get("/allclient", Client.getAllClient);
//getAssociado.php
router.get("/client/:codacesso", Client.getOneClient); // localhost:3001/client/1000000024212
//getAssociadoPorConsutor.php  | getAssociadosPorConsultor.php
router.get("/clientconsult/:codconsultor", Client.getClientConsult); // localhost:3001/clientconsult/1
//getAssociadoPorMercadoria.php | getAssociadosPorMercadoria.php
router.get("/clientmerchandise/:codmercadoria", Client.getClientMerchandise); // localhost:3001/clientmerchandise/19049
//getLojas.php
router.get("/stores/:codconsultor", Client.getStoreConsultant); // localhost:3001/stores/1
// getLojasPorCategoria.php
router.get("/storescategory/:codprovider", Client.getStoresCategory); // localhost:3001/storescategory/333
// getTodasLojas.php
router.get("/stores", Client.getAllStores); // localhost:3001/stores



// Methods Categories
//getCategorias.php
router.get("/categoriesconsult/:codconsult", Category.getCategoryConsult); // localhost:3001/categoriesconsult/1


// Methods Notices
//getNotices.php
router.get("/notices", Notice.getAllNotice); // localhost:3001/notices


// Methods Provider
// getFornecedorPorAssociado.php
router.get("/providerclient/:codconsultor", Provider.getProviderClient); // localhost:3001/providerclient/1
// getFornecedoresFaturamento.php
router.get("/suppliersinvoicing", Provider.getProviderSells); // localhost:3001/suppliersinvoicing
// getFornecedoresCategorias.php
router.get("/providerscategories/:codbuyer", Provider.getProvidersCategories); // localhost:3001/providerscategories/4
// getFornecedoresPorAssociado.php
router.get("/providersconsult/:codconsultclient", Provider.getProvidersClient); // localhost:3001/providersconsult/1
// getTodosFornecedores.php
router.get("/providerconsult/:codconsult", Provider.getProviderConsult); // localhost:3001/providerconsult/5



// Methods Negotiation
// getNegociacaoPorFornecedor.php | getNegociacoes.php
router.get("/negotiationprovider/:codforn", Negotiation.getNegotiationProvider); // localhost:3001/negotiationprovider/333
// getNegociacoesAssociados.php
router.get("/negotiationclient/:codclient/:codforn", Negotiation.getNegotiationClient); // localhost:3001/negotiationclient/9/333



// Methods Buyer
// getCompradoresAssociados
router.get("/buyersclient/:codconsultorclient", Buyer.getBuyersClient); // localhost:3001/buyersclient/1
// getTodosCompradores.php
router.get("/buyers", Buyer.getAllBuyers); // localhost:3001/buyers



// Methods Merchandise
// getMercadoriasPorNegociacaoPorFornecedorInfo.php
router.get("/merchandisenegotitationprovider/:codprovider", Merchandise.getMerchandiseNegotiationProvider); // localhost:3001/merchandisenegotitationprovider/333
// getPedidosInfo.php
router.get("/merchandiseclientprovidernegotiation/:codclient/:codprovider/:codnegotiation", Merchandise.getMerchandiseClientProviderNegotiation); // localhost:3001/merchandiseclientprovidernegotiation/7/333/1
// getMercadoriasFornecedorInfo.php
router.get("/merchandiseprovider/:codprovider", Merchandise.getMerchandiseProvider); // localhost:3001/merchandiseprovider/333
// getMercadorias.php
router.get("/merchandiseproviderifclient/:codclient/:codprovider/:codnegotiation", Merchandise.getMerchandiseProviderIfClient); // localhost:3001/merchandiseproviderifclient/7/333/1



// Methods Request
// getPedidosFornecedoresAssociado.php
router.get("/requestproviderclient/:codclient", Request.getRequestProviderClient); // localhost:3001/requestproviderclient/9
// getPedidos.php
router.get("/requestsprovider/:codprovider", Request.getRequestsProvider); // localhost:3001/requestsprovider/333
// getInserePedido.php
router.post("/insertrequest", Request.postInsertRequest); // localhost:3001/insertrequest


module.exports = router;
