const router = require("express").Router();

const Merchandise = require("@controller/Merchandise");
const Negotiation = require("@controller/Negotiation");
const Provider = require("@controller/Provider");
const Category = require("@controller/Category");
const Request = require("@controller/Request");
const Graphs = require("@controller/Graphs");
const Client = require("@controller/Client");
const Buyer = require("@controller/Buyer");
const Notice = require("@controller/Notice");
const User = require("@controller/User");

// Methods User
// getUsuarios.php
router.post("/getuser", User.getUser); // localhost:3001/getuser

router.post("/getusermore", User.getUserDoubleCompany); // localhost:3001/getuser

router.post("/getuserweb", User.getUserWeb); // localhost:3001/getuser

router.get("/getallusersorg", User.getAllUsersOrg); // localhost:3001/getuser
router.get("/getallusersprovider", User.getAllUsersProvider); // localhost:3001/getuser
router.get("/getallusersassociate", User.getAllUsersAssociate); // localhost:3001/getuser

// Methods Clients
router.get("/allclient", Client.getAllClient);
//getAssociado.php
router.get("/client/:codacesso", Client.getOneClient); // localhost:3001/client/1000000024212
//getAssociadoPorConsutor.php  | getAssociadosPorConsultor.php
router.get("/clientconsult/:codconsultor", Client.getClientConsult); // localhost:3001/clientconsult/1
//getAssociadoPorMercadoria.php | getAssociadosPorMercadoria.php

router.post("/insertperson", Client.postInsertPerson);

router.get("/clientmerchandise/:codmercadoria", Client.getClientMerchandise); // localhost:3001/clientmerchandise/19049
router.get("/clientmerchandisetrading/:codmercadoria/:codnegotiation", Client.getClientMerchandiseTrading); // localhost:3001/clientmerchandise/19049
//getLojas.php
router.get("/stores/:codconsultor", Client.getStoreConsultant); // localhost:3001/stores/1
// getLojasPorCategoria.php
router.get("/storescategory/:codprovider", Client.getStoresCategory); // localhost:3001/storescategory/333
// getTodasLojas.php
router.get("/stores", Client.getAllStores); // localhost:3001/stores
router.get("/storesgraph", Client.getAllStoresGraph); // localhost:3001/stores

router.get("/valueminutegraph", Client.getAllStoresGraphHour); // localhost:3001/stores

router.get("/valuefair", Client.getValueTotalFair); // localhost:3001/stores

router.get("/storesbyprovider/:codprovider", Client.getStoresbyProvider); // localhost:3001/storesbyprovider/3333

// Methods Categories
//getCategorias.php
router.get("/categoriesconsult/:codconsult", Category.getCategoryConsult); // localhost:3001/categoriesconsult/1

// Methods Notices
//getNotices.php
router.get("/notices", Notice.getAllNotice); // localhost:3001/notices
router.get("/schedule", Notice.getAllSchedule); // localhost:3001/notices

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

router.get("/providerdetails/:codforn", Provider.getProviderDetails); // localhost:3001/providerconsult/5

router.post("/insertprovider", Provider.postInsertProvider);

// Methods Negotiation
// getNegociacaoPorFornecedor.php | getNegociacoes.php
router.get("/negotiationprovider/:codforn", Negotiation.getNegotiationProvider); // localhost:3001/negotiationprovider/333
// getNegociacoesAssociados.php
router.get("/negotiationclient/:codclient/:codforn", Negotiation.getNegotiationClient); // localhost:3001/negotiationclient/9/333

router.get("/negotiationclientwithprice/:codclient/:codforn", Negotiation.getNegotiationClientWithPrice); // localhost:3001/negotiationclient/9/333

router.post("/insertnegotiation", Negotiation.PostInsertNegotiation);

router.post("/insertnegotiationrelacionamercadoria", Negotiation.PostInsertNegotiationRelacionaMercadoria);

router.get("/exportnegotiations", Negotiation.GetExportNegotiations);

// router.get("/exportnegotiationsclient/:codeclient", Negotiation.GetExportNegotiationsClient);
router.get("/exportnegotiationsclient/:codeclient", Negotiation.GetExportNegotiationsClientTesteNovo);

// Methods Buyer
// getCompradoresAssociados
router.get("/buyersclient/:codconsultorclient", Buyer.getBuyersClient); // localhost:3001/buyersclient/1

router.get("/buyersprovider/:codprovider", Buyer.getBuyersProvider); // localhost:3001/buyersclient/1

// getTodosCompradores.php
router.get("/buyers", Buyer.getAllBuyers); // localhost:3001/buyers

// Methods Merchandise
// getMercadoriasPorNegociacaoPorFornecedorInfo.php
// router.get("/merchandisenegotitationprovider/:codprovider/:codnegotiation", Merchandise.getMerchandiseNegotiationProvider); // localhost:3001/merchandisenegotitationprovider/333
// getPedidosInfo.php
router.get("/merchandiseclientprovidernegotiation/:codclient/:codprovider/:codnegotiation", Merchandise.getMerchandiseClientProviderNegotiation); // localhost:3001/merchandiseclientprovidernegotiation/7/333/1
// getMercadoriasFornecedorInfo.php
router.get("/merchandiseprovider/:codprovider", Merchandise.getMerchandiseProvider); // localhost:3001/merchandiseprovider/333
// getMercadorias.php
// router.get("/merchandiseproviderifclient/:codclient/:codprovider/:codnegotiation", Merchandise.getMerchandiseProviderIfClient); // localhost:3001/merchandiseproviderifclient/7/333/1
router.get("/merchandiseproviderifclient/:codclient/:codprovider/:codnegotiation", Merchandise.getMerchandiseProviderIfClientLimitNegotiation); // localhost:3001/merchandiseproviderifclient/7/333/1
router.get("/merchandiseproviderifclientlimitnegotiation/:codclient/:codprovider/:codnegotiation", Merchandise.getMerchandiseProviderIfClientLimitNegotiation); // localhost:3001/merchandiseproviderifclient/7/333/1

router.get("/merchandisenegotiationprovider/:codprovider/:codnegotiation", Merchandise.getMerchandiseNegotiationProvider); // localhost:3001/merchandiseproviderifclient/7/333/1

router.get("/merchandisepercustomer/:codclient/:codeprovider", Merchandise.getMerchandisePerCustomer); // localhost:3001/merchandiseproviderifclient/7/333/1

router.get("/merchandiseperclient/:codclient/:codeprovider/:codenegotiation", Merchandise.getMerchandisePerClient); // localhost:3001/merchandiseproviderifclient/7/333/1

router.post("/insertmerchandise", Merchandise.postInsertMerchandise);

// Methods Request
// getPedidosFornecedoresAssociado.php
router.get("/requestproviderclient/:codclient", Request.getRequestProviderClient); // localhost:3001/requestproviderclient/9
router.get("/requesttopproviderclient/:codclient", Request.getRequestTopProviderClient); // localhost:3001/requestproviderclient/9

// getPedidos.php
router.get("/requestsprovider/:codprovider", Request.getRequestsProvider); // localhost:3001/requestsprovider/333

router.get("/requestsprovidernegotiation/:codenegotiation", Request.getRequestsNegotiation); // localhost:3001/requestsprovider/333

router.get("/requestsnegotiationbyclient/:codebranch", Request.getRequestsClientsWithNegotiation); // localhost:3001/requestsprovider/333

router.get("/requestsclients/:codconsult", Request.getRequestsClients); // localhost:3001/requestsprovider/333
// getInserePedido.php
router.post("/insertrequest", Request.postInsertRequest); // localhost:3001/insertrequest

router.post("/insertrequestnew", Request.postInserRequestNew); // localhost:3001/insertrequest

router.get("/allrequestclients", Request.getAllRequests); // localhost:3001/allrequestclientsi

// getInserePedido.php
router.get("/percentageclients/:codprovider", Graphs.getPercentageClients); // localhost:3001/percentageclients/333
router.get("/percentageproviderbyclients/:codbuyer", Graphs.getPercentagePovidersByClients); // localhost:3001/percentageclients/333
router.get("/percentageclientsorganization", Graphs.getPercentageClientsOrganization); // localhost:3001/percentageclients
router.get("/percentageprovidersorganization", Graphs.getPercentageProvidersOrganization); // localhost:3001/percentageclients
router.get("/totalvalueclients/:codprovider", Graphs.getTotalValueClients); // localhost:3001/percentageclients/333
router.get("/information", Graphs.getTotalInformations); // localhost:3001/percentageclients/333

module.exports = router;
