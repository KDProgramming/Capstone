var AppointmentBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadAppointmentFromServer: function () {

        $.ajax({
            url: '/getappointment/',
            data: {
                'appointmentid': appointmentid.value,
                'appointmentservice': apptservice.value,
                'appointmentclient': apptclient.value,
                'appointmentstart': appointmentstart.value,
                'appointmentend': appointmentend.value,
                'appointmentstatus': apptstatus.value, 
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
    componentDidMount: function () {
        this.loadAppointmentFromServer();
    },
    updateSingleAppointmentFromServer: function (appointment) {
        
        $.ajax({
            url: '/updatesingleappointment/',
            dataType: 'json',
            data: appointment,
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

    render: function () {
        return (
            <div>
                <h1>Update Appointment</h1>
                <Appointmentform2 onAppointmentSubmit={this.loadAppointmentFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Client Email</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Service</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                         </thead>
                        <AppointmentList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <AppointmentUpdateform onUpdateSubmit={this.updateSingleAppointmentFromServer} />
                    </div>                
                </div>
            </div>
        );
    }
});

var Appointmentform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentid: "",
            servicedata: [],
            clientdata: [],
            appointmentstart: "",
            appointmentend: "",
            statusdata: [],
        };
    },

    loadServices: function() {
        $.ajax({
            url: '/getservice/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({servicedata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadStatus: function() {
        $.ajax({
            url: '/getapptstatus/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ statusdata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadClients: function() {
        $.ajax({
            url: '/getclients/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ clientdata:data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadServices();
        this.loadStatus();
        this.loadClients();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var appointmentid = this.state.appointmentid.trim();
        var appointmentclient = apptclient.value;
        var appointmentstart = this.state.appointmentstart;
        var appointmentend = this.state.appointmentend;
        var appointmentservice = apptservice.value;
        var appointmentstatus = apptstatus.value;

        this.props.onAppointmentSubmit({ 
            appointmentid: appointmentid, 
            appointmentclient: appointmentclient, 
            appointmentstart: appointmentstart, 
            appointmentend: appointmentend, 
            appointmentservice: appointmentservice,
            appointmentstatus: appointmentstatus,
        });
    },

    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },

    render: function () {
        return (
        <div>
            <div id = "theform">
            <form onSubmit={this.handleSubmit}>
            <h2>Appointments</h2>
            <table>
                    <tbody>
                        <tr>
                            <th>Appointment ID</th>
                            <td>
                                <input 
                                type="text" 
                                name="appointmentid" 
                                id="appointmentid" 
                                value={this.state.appointmentid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Client Email</th>
                            <td>
                            <SelectClient data={this.state.clientdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Start</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="appointmentstart" 
                                id="appointmentstart" 
                                value={this.state.appointmentstart} 
                                onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>End</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="appointmentend" 
                                id="appointmentend" 
                                value={this.state.appointmentend} 
                                onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Service</th>
                            <td>
                            <SelectService data={this.state.servicedata} />
                            </td>
                        </tr>  
                        <tr>
                            <th>Appointment Status</th>
                            <td>
                            <SelectStatus data={this.state.statusdata} />
                            </td>
                        </tr> 
                    </tbody>
                </table>
                <input type="submit" value="Search Appointments" />
            </form>
            </div>
            <div>
                <br />
                <form onSubmit={this.getInitialState}>
                    <input type="submit" value="Clear Form" />
                </form>
            </div>
        </div>
        );
    }
});

var AppointmentUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upappointmentid: "",
            upservicedata: [],
            upclientdata: [],
            upappointmentstart: "",
            upappointmentend: "",
            upstatusdata: [],
        };
    },

    loadStatus: function() {
        $.ajax({
            url: '/getapptstatus/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ upstatusdata:data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadServices: function() {
        $.ajax({
            url: '/getservice/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ upservicedata:data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadClients: function() {
        $.ajax({
            url: '/getclients/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ upclientdata:data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadServices();
        this.loadStatus();
        this.loadClients();
    },

    handleUpSubmit: function (e) {
        e.preventDefault();

        var upappointmentid = upapptid.value;
        var upappointmentservice = upapptservice.value;
        var upappointmentclient = upapptclient.value;
        var upappointmentstart = upapptstart.value;
        var upappointmentend = upapptend.value;
        var upappointmentstatus = upapptstatus.value;

        this.props.onUpdateSubmit({ 
            upappointmentid: upappointmentid, 
            upappointmentservice: upappointmentservice, 
            upappointmentclient: upappointmentclient, 
            upappointmentstart: upappointmentstart, 
            upappointmentend: upappointmentend,
            upappointmentstatus: upappointmentstatus,
        });
    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
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
                            <th>Service</th>
                            <td>
                                <SelectUpdateService data={this.state.upservicedata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Client Email</th>
                            <td>
                            <SelectUpdateClient data={this.state.upclientdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Start</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="upapptstart" 
                                id="upapptstart" 
                                value={this.state.upapptstart} 
                                onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>End</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="upapptend" 
                                id="upapptend" 
                                value={this.state.upapptend} 
                                onChange={this.handleChange}  />
                            </td>
                        </tr>  
                        <tr>
                            <th>Status</th>
                            <td>
                                <SelectUpdateStatus data={this.state.upstatusdata} />
                            </td>
                        </tr> 
                    </tbody>
                </table><br />
                        <input type="hidden" name="upapptid" id="upapptid" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Appointment" />
                    </form>
                </div>
            </div>
        );
    }
});

var AppointmentList = React.createClass({
    render: function () {
        var appointmentNodes = this.props.data.map(function (appointment) {
            return (
                <Appointment
                    key={appointment.appointmentID} // never forget this line!
                    apptid={appointment.appointmentID}
                    apptclient={appointment.clientEmail}
                    apptstart={appointment.appointmentStart}
                    apptend={appointment.appointmentEnd}
                    apptservice={appointment.serviceName}
                    apptstatus={appointment.appointmentStatusName}
                >
                </Appointment>
            );
                       
        });
        
        return (
             <tbody>
                {appointmentNodes}
            </tbody>
        );
    }
});

var Appointment = React.createClass({
    getInitialState: function () {
        return {
            upapptid: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupapptid = this.props.apptid;
        
        this.loadSingleAppointment(theupapptid);
    },
    loadSingleAppointment: function (theupapptid) {
        $.ajax({
            url: '/getsingleappointment/',
            data: {
                'upapptid': theupapptid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateAppointment = this.state.singledata.map(function (appointment) {
                    upapptid.value = theupapptid;
                    upapptclient.value = appointment.clientID;
                    upapptstart.value = appointment.appointmentStart;
                    upapptend.value = appointment.appointmentEnd;
                    upapptservice.value = appointment.serviceID;
                    upapptstatus.value = appointment.appointmentStatusID;
                
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
                                {this.props.apptid} 
                            </td>
                            <td>
                                {this.props.apptclient}
                            </td>
                            <td>
                                {this.props.apptstart}
                            </td>
                            <td>
                                {this.props.apptend}
                            </td>
                            <td>
                                {this.props.apptservice}
                            </td>
                            <td>
                                {this.props.apptstatus}
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

var SelectService = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (servid) {
            return (
                <option
                    key={servid.serviceID}
                    value={servid.serviceID}
                >
                    {servid.serviceName}
                </option>
            );
        });
        return (
            <select name="apptservice" id="apptservice">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectStatus = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (statid) {
            return (
                <option
                    key={statid.appointmentStatusID}
                    value={statid.appointmentStatusID}
                >
                    {statid.appointmentStatusName}
                </option>
            );
        });
        return (
            <select name="apptstatus" id="apptstatus">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectClient = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (cliid) {
            return (
                <option
                    key={cliid.clientID}
                    value={cliid.clientID}
                >
                    {cliid.clientEmail}
                </option>
            );
        });
        return (
            <select name="apptclient" id="apptclient">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateService = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (servID) {
            return (
                <option
                    key={servID.serviceID}
                    value={servID.serviceID}
                >
                    {servID.serviceName}
                </option>
            );
        });
        return (
            <select name="upapptservice" id="upapptservice">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateStatus = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (statID) {
            return (
                <option
                    key={statID.appointmentStatusID}
                    value={statID.appointmentStatusID}
                >
                    {statID.appointmentStatusName}
                </option>
            );
        });
        return (
            <select name="upapptstatus" id="upapptstatus">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateClient = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (cliID) {
            return (
                <option
                    key={cliID.clientID}
                    value={cliID.clientID}
                >
                    {cliID.clientEmail}
                </option>
            );
        });
        return (
            <select name="upapptclient" id="upapptclient">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <AppointmentBox />,
    document.getElementById('content')
);