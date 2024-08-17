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
const Multishow = require("@controller/Multishow");
const Delete = require("@controller/Delete");
const Faceline = require("@controller/Faceline");

router.post("/faceline-user", Faceline.insert);
router.post("/faceline-user-update", Faceline.update);

// Router with the headers
router.post("/getuser", User.getUser);
router.post("/getusermore", User.getUserDoubleCompany);
router.post("/getuserweb", User.getUserWeb);

router.get("/getallusersorg", User.getAllUsersOrg);
router.get("/getallusersprovider", User.getAllUsersProvider);
router.get("/getusersprovidernotinlist", User.getUsersProviderNotInList);
router.get("/getallusersassociate", User.getAllUsersAssociate);

router.get("/allclient", Client.getAllClient);
router.get("/client/:codacesso", Client.getOneClient);
router.get("/clientconsult/:codconsultor", Client.getClientConsult);

router.post("/insertperson", Client.postInsertPerson);
router.post("/insertuser", Client.postInsertUser);
router.post("/updateperson", Client.updatePerson);
router.post("/updateusers", Client.updateUsers);
router.post("/inserrelationprovider", Client.insertRelationProviderClient);

router.get("/clientmerchandise/:codmercadoria", Client.getClientMerchandise);
router.get("/clientmerchandisetrading/:codmercadoria/:codnegotiation", Client.getClientMerchandiseTrading);
router.get("/stores/:codconsultor", Client.getStoreConsultant);
router.get("/storescategory/:codprovider", Client.getStoresCategory);
router.get("/stores", Client.getAllStores);
router.get("/storesgraph", Client.getAllStoresGraph);

router.get("/valueminutegraph", Client.getAllStoresGraphHour);

router.get("/valueminutegraphprovider/:codeprovider", Client.getSellGraphHourProvider);

router.get("/valuefair", Client.getValueTotalFair);

router.get("/storesbyprovider/:codprovider", Client.getStoresbyProvider);

router.get("/categoriesconsult/:codconsult", Category.getCategoryConsult);

router.get("/notices", Notice.getAllNotice);
router.get("/schedule", Notice.getAllSchedule);

router.get("/providerclient/:codconsultor", Provider.getProviderClient);

router.get("/suppliersinvoicing", Provider.getProviderSells);
router.get("/providerscategories/:codbuyer", Provider.getProvidersCategories);
router.get("/providersconsult/:codconsultclient", Provider.getProvidersClient);
router.get("/providerconsult/:codconsult", Provider.getProviderConsult);

router.get("/providerdetails/:codforn", Provider.getProviderDetails);

router.post("/insertprovider", Provider.postInsertProvider);

router.get("/negotiationprovider/:codforn", Negotiation.getNegotiationProvider);
router.get("/negotiationclient/:codclient/:codforn", Negotiation.getNegotiationClient);

router.get("/negotiationproviderclient/:codclient/:codforn", Negotiation.getNegotiationsProviderWithMerchandisePerClient);

router.get("/negotiationclientwithprice/:codclient/:codforn", Negotiation.getNegotiationClientWithPrice);
router.get("/negotiationclientwithpricenotnull/:codclient/:codforn", Negotiation.getNegotiationClientsWithPriceNotNull);

router.post("/insertnegotiation", Negotiation.PostInsertNegotiation);

router.post("/insertnegotiationrelacionamercadoria", Negotiation.PostInsertNegotiationRelacionaMercadoria);

router.get("/exportnegotiations", Negotiation.GetExportNegotiations);

router.get("/exportnegotiationsprovider/:supplier/:buyer/:negotiation", Negotiation.GetExportNegotiationsProvider);

router.get("/exportnegotiationsclient/:codeclient", Negotiation.GetExportNegotiationsClientTesteaaaaaaaaa);

router.get("/exportnegotiationsclientprovider/:codeclient/:codeprovider", Negotiation.GetExportNegotiationsClientPerProvider);
router.get("/exportnegotiationperclient/:codeclient/:codenegotiation", Negotiation.GetExportNegotiationsPerNegotiationClient);
router.get("/exportnegotiationper/:codenegotiation", Negotiation.GetExportNegotiationsPerNegotiation);
router.get("/exportnegotiationperprovider/:codeclient/:codenegotiation", Negotiation.GetExportNegotiationPerProvider);


router.get("/ExportNegotiationsPerProvider/:provider", Negotiation.ExportNegotiationsPerProvider);

router.get("/exportproductnegotiationperprovider/:provider", Negotiation.exportProductsPerNegotiationPerProvider);






router.get("/buyersclient/:codconsultorclient", Buyer.getBuyersClient);

router.get("/buyersprovider/:codprovider", Buyer.getBuyersProvider);

router.get("/buyers", Buyer.getAllBuyers);

router.get("/statusnegotiation", Negotiation.negotiationStatus);
router.get("/statusnegotiation/:code", Negotiation.changeNegotiationStatus);


router.patch("/merchandise/:codMercadoria", Merchandise.patchMerchandise);
router.get("/merchandiseclientprovidernegotiation/:codclient/:codprovider/:codnegotiation", Merchandise.getMerchandiseClientProviderNegotiation);
router.get("/merchandiseprovider/:codprovider", Merchandise.getMerchandiseProvider);
router.get("/merchandiseproviderifclient/:codclient/:codprovider/:codnegotiation", Merchandise.getMerchandiseProviderIfClientLimitNegotiation);
router.get("/merchandiseproviderifclientlimitnegotiation/:codclient/:codprovider/:codnegotiation", Merchandise.getMerchandiseProviderIfClientLimitNegotiation);

router.get("/merchandisenegotiationprovider/:codprovider/:codnegotiation", Merchandise.getMerchandiseNegotiationProvider);

router.get("/merchandisepercustomer/:codclient/:codeprovider", Merchandise.getMerchandisePerCustomer);

router.get("/merchandiseperclient/:codclient/:codeprovider/:codenegotiation", Merchandise.getMerchandisePerClient);

router.post("/insertmerchandise", Merchandise.postInsertMerchandise);

router.get("/requestproviderclient/:codclient", Request.getRequestProviderClient);
router.get("/requesttopproviderclient/:codclient", Request.getRequestTopProviderClient);
router.get("/requesttonegotiationclient/:codclient/:codprovider", Request.getRequestNegotiationProviderClient);
router.get("/requesttonegotiationsperprovider/:codprovider", Request.getRequestNegotiationsPerProvider);

router.get("/requestsprovider/:codprovider", Request.getRequestsProvider);
router.get("/exportrequestsprovider/:provider", Request.ExportClientsPerProvider);


router.get("/requestsprovidernegotiation/:codenegotiation", Request.getRequestsNegotiation);

router.get("/requestsnegotiationbyclient/:codebranch", Request.getRequestsClientsWithNegotiation);

router.get("/requestsclients/:codconsult", Request.getRequestsClients);
router.post("/insertrequest", Request.postInsertRequest);

router.post("/insertrequestnew", Request.postInserRequestNew);

router.get("/allrequestclients", Request.getAllRequests);

router.get("/percentageclients/:codprovider", Graphs.getPercentageClients);
router.get("/percentageproviderbyclients/:codbuyer", Graphs.getPercentagePovidersByClients);
router.get("/percentageclientsorganization", Graphs.getPercentageClientsOrganization);
router.get("/percentageprovidersorganization", Graphs.getPercentageProvidersOrganization);
router.get("/totalvalueclients/:codprovider", Graphs.getTotalValueClients);
router.get("/information", Graphs.getTotalInformations);
router.get("/exportpdf/:supplier/:negotiation/:client", Graphs.getExportPdf);

router.get("getnegotiationmultishow/:category", Graphs.getExportPdf);

router.post("/multishow/negotiation", Multishow.getNegotiations);

router.get("/multishow/merchandiserefresh/:product/:negotiation", Multishow.refreshMerchandise);

router.get("/deleteallinformations", Delete.deleteAll);









module.exports = router;
