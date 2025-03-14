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
                console.log("Data: ", data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    componentDidMount: function () {
        this.loadAppointmentFromServer();
    },

    render: function () {
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
    loadServices: function() {
        $.ajax({
            url: '/getservice/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ servicedata:data });
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
    componentDidMount: function () {
        this.loadServices();
        this.loadStatus();
        this.loadClients();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var appointmentid = this.state.appointmentid.trim();
        var appointmentclientid = apptclient.value;
        var appointmentstart = this.state.appointmentstart;
        var appointmentend = this.state.appointmentend;
        var appointmentservice = apptservice.value;
        var appointmentstatus = apptstatus.value;

        this.props.onAppointmentSubmit({ 
            appointmentid: appointmentid, 
            appointmentclientid: appointmentclientid, 
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
            <form onSubmit={this.handleSubmit}>
                <h2>Appointment Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>ID</th>
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
                            <th>Service</th>
                            <td>
                            <SelectService data={this.state.servicedata} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Status</th>
                            <td>
                            <SelectStatus data={this.state.statusdata} />
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

