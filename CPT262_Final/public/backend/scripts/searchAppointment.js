var ususer = 0;
var AppointmentBox = React.createClass({
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
                    this.loadAppointmentFromServer();
                }
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleAppointmentSubmit: function (appointment) {
        $.ajax({ 
            url: '/appointment/',
            dataType: 'json',
            type: 'POST',
            data: appointment,
            success: function (data) {
                this.setState({ data: data}); 
            }.bind(this), 
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }, 
    loadAppointmentFromServer: function () {
        console.log("Load appointment triggered!")
        $.ajax({
            url: '/getappointment/',
            data: {
                'kd_appointmentid': kd_appointmentid.value,
                'kd_appointmentservice': apptservice.value,
                'kd_appointmentclient': apptclient.value,
                'kd_appointmentstart': kd_appointmentstart.value,
                'kd_appointmentend': kd_appointmentend.value,
                'kd_appointmentstatus': apptstatus.value, 
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
                console.log("Data: ", data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    componentDidMount: function () {
        this.loadAllowLogin();
        this.loadAppointmentFromServer();
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
                    <h1>Search Appointment</h1>
                    <Appointmentform2 onAppointmentSubmit={this.loadAppointmentFromServer} />
                    <br />
                    <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Service</th>
                                    <th>ClientID</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <AppointmentList data={this.state.data} />
                        </table>
                    
                </div>
            );
        }
    }
});

var Appointmentform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_appointmentid: "",
            kd_servicedata: [],
            kd_clientdata: [],
            kd_appointmentstart: "",
            kd_appointmentend: "",
            kd_statusdata: [],
        };
    },
    loadClients: function() {
        $.ajax({
            url: '/getclients/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ kd_clientdata:data });
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
                this.setState({ kd_servicedata:data });
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
                this.setState({ kd_statusdata:data});
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

        var kd_appointmentid = this.state.kd_appointmentid.trim();
        var kd_appointmentclientid = apptclient.value;
        var kd_appointmentstart = this.state.kd_appointmentstart;
        var kd_appointmentend = this.state.kd_appointmentend;
        var kd_appointmentservice = apptservice.value;
        var kd_appointmentstatus = apptstatus.value;

        this.props.onAppointmentSubmit({ 
            kd_appointmentid: kd_appointmentid, 
            kd_appointmentclientid: kd_appointmentclientid, 
            kd_appointmentstart: kd_appointmentstart, 
            kd_appointmentend: kd_appointmentend, 
            kd_appointmentservice: kd_appointmentservice,
            kd_appointmentstatus: kd_appointmentstatus,
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
                <h2>Appointment Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <td>
                                <input 
                                type="text" 
                                name="kd_appointmentid" 
                                id="kd_appointmentid" 
                                value={this.state.kd_appointmentid} 
                                onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Client Email</th>
                            <td>
                                <SelectClient data={this.state.kd_clientdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Start</th>
                            <td>
                            <input 
                                type = "datetime-local" 
                                name="kd_appointmentstart" 
                                id="kd_appointmentstart" 
                                value={this.state.kd_appointmentstart} 
                                onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>End</th>
                            <td>
                            <input 
                                type = "datetime-local" 
                                name="kd_appointmentend" 
                                id="kd_appointmentend" 
                                value={this.state.kd_appointmentend} 
                                onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Service</th>
                            <td>
                            <SelectService data={this.state.kd_servicedata} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Status</th>
                            <td>
                            <SelectStatus data={this.state.kd_statusdata} />
                            </td>
                        </tr>  
                    </tbody>
                </table>
                <input type="submit" value="Search Appointment" />

            </form>
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
                    apptstart={appointment.formattedStart}
                    apptend={appointment.formattedEnd}
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

    render: function () {
        return (

            <tr>
                            <td>
                                {this.props.apptid} 
                            </td>
                            <td>
                                {this.props.apptservice}
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
                                {this.props.apptstatus}
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

ReactDOM.render(
    <AppointmentBox />,
    document.getElementById('content')
);

