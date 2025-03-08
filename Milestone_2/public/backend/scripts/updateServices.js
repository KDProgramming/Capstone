var ServicesBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadServicesFromServer: function () {
        $.ajax({
            url: '/getservices/',
            data: {
                'serviceid': serviceid.value,
                'servicename': servicename.value,
                'serviceblocks': serviceblocks.value,
                'serviceprice': serviceprice.value,          
            },
            
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    updateSingleServiceFromServer: function (service) {
        
        $.ajax({
            url: '/updatesingleservice/',
            dataType: 'json',
            data: service,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadServicesFromServer();
    },

    render: function () {
        return (
            <div>
                <h1>Update Service</h1>
                <Servicesform2 onServicesSubmit={this.loadServicesFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Blocks</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                         </thead>
                        <ServicesList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <ServicesUpdateform onUpdateSubmit={this.updateSingleServiceFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Servicesform2 = React.createClass({
    getInitialState: function () {
        return {
            serviceid: "",
            servicename: "",
            serviceblocks: "",
            serviceprice: "",
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var serviceid = this.state.serviceid.trim();
        var servicename = this.state.servicename.trim();
        var serviceblocks = this.state.serviceblocks.trim();
        var serviceprice = this.state.serviceprice.trim();

        this.props.onServicesSubmit({ 
            serviceid: serviceid, 
            servicename: servicename, 
            serviceblocks: serviceblocks, 
            serviceprice: serviceprice,
        });
    },
    
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Services</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Service ID</th>
                            <td>
                                <input 
                                type="text" 
                                name="serviceid" 
                                id="serviceid" 
                                value={this.state.serviceid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Name</th>
                            <td>
                                <input 
                                name="servicename" 
                                id="servicename" 
                                value={this.state.servicename} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Blocks</th>
                            <td>
                                <input 
                                name="serviceblocks" 
                                id="serviceblocks" 
                                value={this.state.serviceblocks} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Price</th>
                            <td>
                                <input 
                                name="serviceprice" 
                                id="serviceprice" 
                                value={this.state.serviceprice} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Services" />

            </form>
        );
    }
});

var ServicesUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upserviceid: "",
            upservicename: "",
            upserviceblocks: "",
            upserviceprice: "",
        };
    },
    
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upserviceid = upservid.value;
        var upservicename = upservname.value;
        var upserviceblocks = upservblocks.value;
        var upserviceprice = upservprice.value;

        this.props.onUpdateSubmit({ 
            upserviceid: upserviceid, 
            upservicename: upservicename, 
            upserviceblocks: upserviceblocks, 
            upserviceprice: upserviceprice, 
        });
    },
    
    render: function () {
        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleUpSubmit}>
                    <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>
                                <input 
                                name="upservname" 
                                id="upservname" 
                                value={this.state.upservname} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Blocks</th>
                            <td>
                                <input 
                                name="upservblocks" 
                                id="upservblocks" 
                                value={this.state.upservblocks} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Price</th>
                            <td>
                                <input 
                                name="upservprice" 
                                id="upservprice" 
                                value={this.state.upservprice} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>
                    </tbody>
                </table><br />
                        <input type="hidden" name="upservid" id="upservid" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Service" />
                    </form>
                </div>
            </div>
        );
    }
});

var ServicesList = React.createClass({
    render: function () {
        var servicesNodes = this.props.data.map(function (services) {
            return (
                <Services
                    key={services.serviceID} // never forget this line!
                    servid={services.serviceID}
                    servname={services.serviceName}
                    servblocks={services.serviceBlocks}
                    servprice={services.servicePrice}
                >
                </Services>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {servicesNodes}
            </tbody>
        );
    }
});

var Services = React.createClass({
    getInitialState: function () {
        return {
            upservid: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupservid = this.props.servid;
        
        this.loadSingleService(theupservid);
    },
    loadSingleService: function (theupservid) {
        $.ajax({
            url: '/getsingleservice/',
            data: {
                'upservid': theupservid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateService = this.state.singledata.map(function (service) {
                    upservid.value = theupservid;
                    upservname.value = service.serviceName;
                    upservblocks.value = service.serviceBlocks;
                    upservprice.value = service.servicePrice;

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.servid} 
                            </td>
                            <td>
                                {this.props.servname}
                            </td>
                            <td>
                                {this.props.servblocks}
                            </td>
                            <td>
                                {this.props.serviceprice}
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <ServicesBox />,
    document.getElementById('content')
);