var ususer = 0;
var AppointmentBox = React.createClass({
    getInitialState: function() {
        return { viewthepage: 0 };
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedinback/',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ viewthepage: data });
                ususer = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadAllowLogin();
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
                <div className="AppointmentBox">
                    <h1>Insert Appointment</h1>
                    <Appointmentform2 onAppointmentSubmit={this.handleAppointmentSubmit}/>
                </div>
            );
        }
    }
});

var Appointmentform2 = React.createClass({
    getInitialState: function () {
        return {
            kd_appointmentstart: "",
            kd_appointmentend: "",
            kd_servicedata: [],
            kd_clientdata: [],
            kd_statusdata: [],
            kd_selectedService: ""
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
                this.setState({kd_servicedata:data});
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
        
        var kd_appointmentclient = apptclient.value;
        var kd_appointmentservice = apptservice.value;
        var kd_appointmentstatus = apptstatus.value;
        var kd_appointmentstart = this.state.kd_appointmentstart;
        var kd_appointmentend = this.state.kd_appointmentend;

        console.log("Start Date: " + kd_appointmentstart);
        console.log("End Date: " + kd_appointmentend);

        this.props.onAppointmentSubmit({ 
            kd_appointmentclient: kd_appointmentclient,
            kd_appointmentservice: kd_appointmentservice,
            kd_appointmentstatus: kd_appointmentstatus,
            kd_appointmentstart: kd_appointmentstart,
            kd_appointmentend: kd_appointmentend
        });
    },

    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    setValue: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function () {

        return (
            <form className="appointmentForm" onSubmit={this.handleSubmit}>
                <h2>Appointment Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Client Email</th>
                            <td>
                                <SelectClient data={this.state.kd_clientdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Service</th>
                            <td>
                                <SelectService data={this.state.kd_servicedata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Blocks</th>
                            <td>
                                <text>Please Select Your Start and End Dates Accordingly: </text><br/>
                                <br/><GetBlocks data={this.state.kd_servicedata} selectedService={this.state.kd_selectedService} /><br/>
                                <text>1 Block: 30 Minutes</text><br/>
                                <text>2 Blocks: 1 Hour</text><br/>
                            </td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>
                                <SelectStatus data={this.state.kd_statusdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Start Date</th>
                            <td>
                                <input 
                                type = "datetime-local" 
                                name="kd_appointmentstart" 
                                id="kd_appointmentstart" 
                                value={this.state.kd_appointmentstart} 
                                onChange={this.handleChange}
                                step="1800"  />
                            </td>
                            </tr>
                            <tr>
                                <th>End Date</th>
                                <td>
                                    <input 
                                    type = "datetime-local" 
                                    name="kd_appointmentend" 
                                    id="kd_appointmentend" 
                                    value={this.state.kd_appointmentend} 
                                    onChange={this.handleChange}
                                    step="1800" />
                                </td>
                            </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Appointment" />
               
            </form>
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
                <option value="">Select a Client</option>
                {optionNodes}
            </select>
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
            <select name="apptservice" id="apptservice" onChange={this.props.onChange}>
                <option value="">Select a Service</option>
                {optionNodes}
            </select>
        );
    }
});

var GetBlocks = React.createClass({
    render: function () {
        return (
            <div>
                {this.props.data.map((service) => (
                    <div className="blocks" key={service.serviceID}>
                        <span>{service.serviceName}: {service.serviceBlocks} Block(s)</span>
                    </div>
                ))}
            </div>
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
                <option value="">Select a Status</option>
                {optionNodes}
            </select>
        );
    }
});

var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
                <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <AppointmentBox />,
    document.getElementById('content')
);
