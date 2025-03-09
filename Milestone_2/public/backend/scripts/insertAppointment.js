var AppointmentBox = React.createClass({
    // handle submit button click
    handleAppointmentSubmit: function (appointment) {
        $.ajax({ // parse values being sent to ajax as ajax type
            url: '/appointment/',
            dataType: 'json',
            type: 'POST',
            data: appointment,
            success: function (data) {
                this.setState({ data: data}); // set state of data to appointment data
            }.bind(this), // bind data to referring object
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div className="AppointmentBox">
                <h1>Appointments</h1>
                <Appointmentform2 onAppointmentSubmit={this.handleAppointmentSubmit}/>
            </div>
        );
    }
});

var Appointmentform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentstart: "",
            appointmentend: "",
            servicedata: [],
            appointmentclientid: "",
            statusdata: []
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
    componentDidMount: function () {
        this.loadServices();
        this.loadStatus();
    },

    handleSubmit: function (e) { 
        e.preventDefault();
        
        var appointmentclientid = this.state.appointmentclientid.trim();
        var appointmentservice = apptservice.value;
        var appointmentstatus = apptstatus.value;
        var appointmentstart = this.state.appointmentstart;
        var appointmentend = this.state.appointmentend;

        console.log("Start Date: " + appointmentstart);
        console.log("End Date: " + appointmentend);

        if (isNaN(appointmentclientid)) {
            console.log("Client ID Must Be Numberic");
            return;
        }
        if (!appointmentclientid) {
            return;
        }

        this.props.onAppointmentSubmit({ 
            appointmentclientid: appointmentclientid,
            appointmentservice: appointmentservice,
            appointmentstatus: appointmentstatus,
            appointmentstart: appointmentstart,
            appointmentend: appointmentend
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
                <h2>Appointments</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Appointment Client ID</th>
                            <td>
                            <TextInput
                                    value={this.state.appointmentclientid}
                                    uniqueName="appointmentclientid"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentclientid')}
                                    errorMessage="Client ID is invalid"
                                    emptyMessage="Client ID is required" />
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
                        <tr>
                            <th>Start Date</th>
                            <td>
                                <input 
                                type = "date" 
                                name="appointmentstart" 
                                id="appointmentstart" 
                                value={this.state.appointmentstart} 
                                onChange={this.handleChange}  />
                            </td>
                            </tr>
                            <tr>
                                <th>End Date</th>
                                <td>
                                    <input 
                                    type = "date" 
                                    name="appointmentend" 
                                    id="appointmentend" 
                                    value={this.state.appointmentend} 
                                    onChange={this.handleChange} />
                                </td>
                            </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Appointment" />
               
            </form>
        );
    }
});

var SelectService = React.createClass({
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
            <select name="apptservice" id="apptservice">
                {optionNodes}
            </select>
        );
    }
});

var SelectStatus = React.createClass({
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
            <select name="apptstatus" id="apptstatus">
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
