var ususer = 0;

function formatDate(datetimeStr) {
    const date = new Date(datetimeStr);
    const pad = (n) => n.toString().padStart(2, '0');

    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());

    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

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
    loadAppointmentFromServer: function () {

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
    componentDidMount: function () {
        this.loadServices();
        this.loadStatus();
        this.loadClients();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        const start = new Date(this.state.kd_appointmentstart);
        const end = new Date(this.state.kd_appointmentend);

        const isValidTime = (date) => {
            const hour = date.getHours();
            return hour >= 9 && hour < 17;
        };

        if (!isValidTime(start) || !isValidTime(end)) {
            alert("Appointments must be between 9:00 AM and 5:00 PM.");
            return;
        }

        console.log("Submitting:", this.state);

        var kd_appointmentid = this.state.kd_appointmentid.trim();
        var kd_appointmentclient = apptclient.value;
        var kd_appointmentstart = this.state.kd_appointmentstart;
        var kd_appointmentend = this.state.kd_appointmentend;
        var kd_appointmentservice = apptservice.value;
        var kd_appointmentstatus = apptstatus.value;

        this.props.onAppointmentSubmit({ 
            kd_appointmentid: kd_appointmentid, 
            kd_appointmentclient: kd_appointmentclient, 
            kd_appointmentstart: kd_appointmentstart, 
            kd_appointmentend: kd_appointmentend, 
            kd_appointmentservice: kd_appointmentservice,
            kd_appointmentstatus: kd_appointmentstatus,
        });
    },

    handleChange: function (event) {
        const name = e.target.name;
        const value = e.target.value;

        if (name === "kd_appointmentstart" || name === "kd_appointmentend") {
            const date = new Date(value);
            const hours = date.getHours();

            if (hours < 9 || hours >= 17) {
                alert("Please select a time between 9:00 AM and 5:00 PM.");
                return;
            }
        }

        this.setState({
            [name]: value
        });

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
                                onChange={this.handleChange} 
                                step="1800" />
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
                                onChange={this.handleChange}
                                step="1800"  />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Service</th>
                            <td>
                            <SelectService data={this.state.kd_servicedata} />
                            </td>
                        </tr>  
                        <tr>
                            <th>Appointment Status</th>
                            <td>
                            <SelectStatus data={this.state.kd_statusdata} />
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
            kd_upappointmentid: "",
            kd_upservicedata: [],
            kd_upclientdata: [],
            kd_upappointmentstart: "",
            kd_upappointmentend: "",
            kd_upstatusdata: [],
        };
    },

    loadStatus: function() {
        $.ajax({
            url: '/getapptstatus/',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ kd_upstatusdata:data});
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
                this.setState({ kd_upservicedata:data });
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
                this.setState({ kd_upclientdata:data });
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

        var kd_upappointmentid = kd_upapptid.value;
        var kd_upappointmentservice = upapptservice.value;
        var kd_upappointmentclient = upapptclient.value;
        var kd_upappointmentstart = kd_upapptstart.value;
        var kd_upappointmentend = kd_upapptend.value;
        var kd_upappointmentstatus = upapptstatus.value;

        this.props.onUpdateSubmit({ 
            kd_upappointmentid: kd_upappointmentid, 
            kd_upappointmentservice: kd_upappointmentservice, 
            kd_upappointmentclient: kd_upappointmentclient, 
            kd_upappointmentstart: kd_upappointmentstart, 
            kd_upappointmentend: kd_upappointmentend,
            kd_upappointmentstatus: kd_upappointmentstatus,
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
                                <SelectUpdateService data={this.state.kd_upservicedata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Client Email</th>
                            <td>
                            <SelectUpdateClient data={this.state.kd_upclientdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Start</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="kd_upapptstart" 
                                id="kd_upapptstart" 
                                value={this.state.kd_upapptstart} 
                                onChange={this.handleChange}
                                step="1800"  />
                            </td>
                        </tr>
                        <tr>
                            <th>End</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="kd_upapptend" 
                                id="kd_upapptend" 
                                value={this.state.kd_upapptend} 
                                onChange={this.handleChange}
                                step="1800"  />
                            </td>
                        </tr>  
                        <tr>
                            <th>Status</th>
                            <td>
                                <SelectUpdateStatus data={this.state.kd_upstatusdata} />
                            </td>
                        </tr> 
                    </tbody>
                </table><br />
                        <input type="hidden" name="kd_upapptid" id="kd_upapptid" onChange={this.handleUpChange} />
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
    getInitialState: function () {
        return {
            kd_upapptid: "",
            kd_singledata: []
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
                'kd_upapptid': theupapptid
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ kd_singledata: data });
                console.log(this.state.kd_singledata);
                var populateAppointment = this.state.kd_singledata.map(function (appointment) {
                    kd_upapptid.value = theupapptid;
                    upapptclient.value = appointment.clientID;
                    kd_upapptstart.value = formatDate(appointment.appointmentStart);
                    kd_upapptend.value = formatDate(appointment.appointmentEnd);
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