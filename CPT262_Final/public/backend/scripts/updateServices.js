var ususer = 0;
var ServicesBox = React.createClass({
    getInitialState: function () {
        return { data: [], viewthepage: 0 };
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedinback/',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ viewthepage: data });
                if (data !== 0) {
                    this.loadServicesFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadServicesFromServer: function () {
        $.ajax({
            url: '/getservices/',
            data: {
                'kd_serviceid': kd_serviceid.value,
                'kd_servicename': kd_servicename.value,
                'kd_serviceblocks': kd_serviceblocks.value,
                'kd_serviceprice': kd_serviceprice.value,          
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
        this.loadAllowLogin();
        this.loadServicesFromServer();
    },

    render: function () {
        if (this.state.viewthepage == 0) {
            return (
                <div>
                    <br/>Please Login!
                    <br/><a href="index.html">Access Login Page Here</a>
                </div>
            );
        } else { 
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
    }
});

var Servicesform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_serviceid: "",
            kd_servicename: "",
            kd_serviceblocks: "",
            kd_serviceprice: "",
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var kd_serviceid = this.state.kd_serviceid.trim();
        var kd_servicename = this.state.kd_servicename.trim();
        var kd_serviceblocks = this.state.kd_serviceblocks.trim();
        var kd_serviceprice = this.state.kd_serviceprice.trim();

        this.props.onServicesSubmit({ 
            kd_serviceid: kd_serviceid, 
            kd_servicename: kd_servicename, 
            kd_serviceblocks: kd_serviceblocks, 
            kd_serviceprice: kd_serviceprice,
        });
    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
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
                                name="kd_serviceid" 
                                id="kd_serviceid" 
                                value={this.state.kd_serviceid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Name</th>
                            <td>
                                <input 
                                name="kd_servicename" 
                                id="kd_servicename" 
                                value={this.state.kd_servicename} 
                                onChange={this.handleChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Blocks</th>
                            <td>
                                <input 
                                name="kd_serviceblocks" 
                                id="kd_serviceblocks" 
                                value={this.state.kd_serviceblocks} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Service Price</th>
                            <td>
                                <input 
                                name="kd_serviceprice" 
                                id="kd_serviceprice" 
                                value={this.state.kd_serviceprice} 
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
            kd_upserviceid: "",
            kd_upservicename: "",
            kd_upserviceblocks: "",
            kd_upserviceprice: "",
        };
    },
    
    handleUpSubmit: function (e) {
        e.preventDefault();

        var kd_upserviceid = kd_upservid.value;
        var kd_upservicename = kd_upservname.value;
        var kd_upserviceblocks = kd_upservblocks.value;
        var kd_upserviceprice = kd_upservprice.value;

        this.props.onUpdateSubmit({ 
            kd_upserviceid: kd_upserviceid, 
            kd_upservicename: kd_upservicename, 
            kd_upserviceblocks: kd_upserviceblocks, 
            kd_upserviceprice: kd_upserviceprice, 
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
                                name="kd_upservname" 
                                id="kd_upservname" 
                                value={this.state.kd_upservname} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Blocks</th>
                            <td>
                                <input 
                                name="kd_upservblocks" 
                                id="kd_upservblocks" 
                                value={this.state.kd_upservblocks} 
                                onChange={this.handleUpChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Price</th>
                            <td>
                                <input 
                                name="kd_upservprice" 
                                id="kd_upservprice" 
                                value={this.state.kd_upservprice} 
                                onChange={this.handleUpChange}  
                                />
                            </td>
                        </tr>
                    </tbody>
                </table><br />
                        <input type="hidden" name="kd_upservid" id="kd_upservid" onChange={this.handleUpChange} />
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
            kd_upservid: "",
            kd_singledata: []
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
                'kd_upservid': theupservid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ kd_singledata: data });
                console.log(this.state.kd_singledata);
                var populateService = this.state.kd_singledata.map(function (service) {
                    kd_upservid.value = theupservid;
                    kd_upservname.value = service.serviceName;
                    kd_upservblocks.value = service.serviceBlocks;
                    kd_upservprice.value = service.servicePrice;

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
                                {this.props.servprice}
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