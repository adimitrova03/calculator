import React, { Component } from 'react';
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);

        this.localStorageUpdated = this.localStorageUpdated.bind(this);
        this.state = {
            value: 0,
            oldValue: 0,
            isOperationAllowed: true,
            memory: [],
            showMemoryList: false,
            showList: false,
            allValues: [],
            allValuesTemporary: [],
            operation: ''
        };
    }

    /**
    * @description react lifecycle hook used to check if storage is updated
    * @name componentDidMount
    */
    componentDidMount() {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('calculatorValues')) {
                let calculatorValues = JSON.parse(localStorage.getItem('calculatorValues'));

                this.setState({
                    value: calculatorValues.value,
                    oldValue: calculatorValues.oldValue,
                    isOperationAllowed: calculatorValues.isOperationAllowed,
                    memory: calculatorValues.memory,
                    showMemoryList: calculatorValues.showMemoryList,
                    showList: calculatorValues.showList,
                    allValues: calculatorValues.allValues,
                    allValuesTemporary: calculatorValues.allValuesTemporary,
                    operation: calculatorValues.operation

                })
            }
            window.addEventListener('storage', this.localStorageUpdated);
        }
    }

    /**
     * @description react lifecycle hook used to remove the listener for the local storage
     * @name componentWillUnmount
     */
    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('storage', this.localStorageUpdated);
        }
    }

    /**
     * @description update state with the local storage information
     * @name localStorageUpdated
     */
    localStorageUpdated() {
        if (localStorage.getItem('calculatorValues')) {
            let calculatorValues = JSON.parse(localStorage.getItem('calculatorValues'));

            this.setState({
                value: calculatorValues.value,
                oldValue: calculatorValues.oldValue,
                isOperationAllowed: calculatorValues.isOperationAllowed,
                memory: calculatorValues.memory,
                showMemoryList: calculatorValues.showMemoryList,
                showList: calculatorValues.showList,
                allValues: calculatorValues.allValues,
                allValuesTemporary: calculatorValues.allValuesTemporary,
                operation: calculatorValues.operation

            });
        }
    }

    /**
    * @description Function used when you type at the input
    * @name updateState
    * @param e: string
    */
    updateState = (e) => {
        if (isNaN(e) === false) {
            let value = this.state.value && this.state.isOperationAllowed === true ? this.state.value.toString() + e : e;
            this.setState({
                value: value,
                isOperationAllowed: true
            })
        } else if (e === 'dot') {
            const value = this.state.value.toString();
            if (this.state.value && value.indexOf('.') === -1) {
                this.setState({
                    value: this.state.value.toString() + '.',
                    isOperationAllowed: true
                })
            }
        }
    };

    /**
     * @description simple calculator operations
     * @name updateCalculation
     * @param type: string
     */
    updateCalculation = (type) => {
        let newValue;

        if (this.state.operation && this.state.isOperationAllowed === true) {
            switch (this.state.operation) {
                case 'plus':
                    newValue = parseFloat(this.state.oldValue) + parseFloat(this.state.value);
                    this.setState({
                        value: newValue,
                        oldValue: newValue,
                        allValuesTemporary: this.state.allValuesTemporary.concat('+' + this.state.value)
                    });
                    break;
                case 'minus':
                    newValue = parseFloat(this.state.oldValue) - parseFloat(this.state.value);
                    this.setState({
                        value: newValue,
                        oldValue: newValue,
                        allValuesTemporary: this.state.allValuesTemporary.concat('-' + this.state.value)
                    });
                    break;
                case 'multiplication':
                    newValue = parseFloat(this.state.oldValue) * parseFloat(this.state.value);
                    this.setState({
                        value: newValue,
                        oldValue: newValue,
                        allValuesTemporary: this.state.allValuesTemporary.concat('*' + this.state.value)
                    });
                    break;
                case 'divide':
                    newValue = parseFloat(this.state.oldValue) / parseFloat(this.state.value);
                    this.setState({
                        value: newValue,
                        oldValue: newValue,
                        allValuesTemporary: this.state.allValuesTemporary.concat('/' + this.state.value)
                    });
                    break;
                default:
                    break;
            }
        } else {
            this.setState({
                oldValue: this.state.value,
                allValuesTemporary: this.state.allValuesTemporary.concat(this.state.value)
            });
        }

        this.setState({
            operation: type,
            isOperationAllowed: false
        });
    };

    /**
    * @description Equal function 
    * @name equal
    * @return state.values: string
    */
    equal = () => {
        this.updateCalculation(this.state.operation);
        setTimeout(() => {
            this.setState(state => {
                let allValues = state.allValuesTemporary;
                allValues = allValues.concat('=' + this.state.value);

                return {
                    allValues
                };
            })
        });
    }

    deleteValue = () => {
        this.setState({
            value: 0
        });
    };

    deleteAll = () => {
        this.setState({
            oldValue: 0,
            value: 0,
            allValues: [],
            operation: '',
            isOperationAllowed: false,
            allValuesTemporary: []
        });
    };

    delete = () => {
        let value = this.state.value.toString();
        this.setState({
            value: this.state.value !== '0' && this.state.value.length > 1 ? value.substring(0, this.state.value.length - 1) : '0'
        })
    };

    percent = () => {
        this.setState({
            value: parseFloat(this.state.value) * 0.01
        })
    };

    square = () => {
        this.setState({
            value: parseFloat(this.state.value) * parseFloat(this.state.value)
        })
    };

    radical = () => {
        let value = parseFloat(this.state.value);
        this.setState({
            value: Math.sqrt(value)
        })
    };

    multiplicativeInverse = () => {
        this.setState({
            value: 1 / parseFloat(this.state.value)
        })
    };

    reverse = () => {
        this.setState({
            value: parseFloat(this.state.value) > 0 ? -parseFloat(this.state.value) : +parseFloat(this.state.value)
        })
    };

    /**
    * @description Memory Operations
    * @name memory
    * @param action: string
    */
    memory = (action) => {
        switch (action) {
            case 'clear':
                this.setState({
                    memory: []
                });
                break;
            case 'recall':
                this.setState({
                    value: this.state.memory.length ? this.state.memory[this.state.memory.length - 1] : this.state.value
                });
                break;
            case 'add':
                this.setState(state => {
                    let memory = state.memory;
                    memory[memory.length - 1] = memory[memory.length - 1] + parseFloat(state.value);

                    return {
                        memory
                    };
                });
                break;
            case 'subtract':
                this.setState(state => {
                    let memory = state.memory;
                    memory[memory.length - 1] = memory[memory.length - 1] - parseFloat(state.value);

                    return {
                        memory
                    };
                });
                break;
            case 'store':
                this.setState(state => {
                    const memory = state.memory.concat(state.value);
                    return {
                        memory
                    };
                });
                break;
            case 'list':
                this.setState({
                    showMemoryList: !this.state.showMemoryList
                })
                break;
            default:
                break;
        }
    };

    history = () => {
        this.setState({
            showList: !this.state.showList
        })
    };

    /**
    * @description React lifecyclehook used to check if the state is change ==> update Local Storage
    * @name componentDidUpdate
    */
    componentDidUpdate() {
        localStorage.setItem('calculatorValues', JSON.stringify(this.state));
    }

    render() {
        return (
            <div className="calculator-wrapper">
                <div className="logo">
                    <img src={window.location.origin + "/assets/logo.png"} alt="made by alex" />
                </div>
                <div className="calculator-display">
                    <div className="history" onClick={() => this.history()}>
                        <svg id="Capa_1" height="512" viewBox="0 0 551.13 551.13" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m275.531 172.228-.05 120.493c0 4.575 1.816 8.948 5.046 12.177l86.198 86.181 24.354-24.354-81.153-81.136.05-113.361z" /><path d="m310.011 34.445c-121.23 0-221.563 90.033-238.367 206.674h-71.644l86.114 86.114 86.114-86.114h-65.78c16.477-97.589 101.355-172.228 203.563-172.228 113.966 0 206.674 92.707 206.674 206.674s-92.707 206.674-206.674 206.674c-64.064 0-123.469-28.996-162.978-79.555l-27.146 21.192c46.084 58.968 115.379 92.808 190.124 92.808 132.955 0 241.119-108.181 241.119-241.119s-108.164-241.119-241.119-241.12z" /></svg>
                    </div>
                    <input type="text" value={this.state.value} onChange={() => { }} />
                    <div className="calculator-buttons">
                        <span onClick={() => this.memory('clear')}>MC</span>
                        <span onClick={() => this.memory('recall')}>MR</span>
                        <span onClick={() => this.memory('add')}>M+</span>
                        <span onClick={() => this.memory('subtract')}>M-</span>
                        <span onClick={() => this.memory('store')}>MS</span>
                        <span onClick={() => this.memory('list')}>M^</span>
                    </div>
                </div>

                <div className="calculator-buttons">
                    <span onClick={() => this.percent()}>%</span>
                    <span onClick={() => this.radical()}>&#8730;</span>
                    <span onClick={() => this.square()}>x&sup2;</span>
                    <span onClick={() => this.multiplicativeInverse()}>1/x</span>
                </div>
                <div className="calculator-buttons">
                    <span onClick={() => this.deleteValue()}>CE</span>
                    <span onClick={() => this.deleteAll()}>C</span>
                    <span onClick={() => this.delete()}>del</span>
                    <span onClick={() => this.updateCalculation('divide')}>&divide;</span>
                </div>
                <div className="calculator-buttons">
                    <span onClick={() => this.updateState(7)}>7</span>
                    <span onClick={() => this.updateState(8)}>8</span>
                    <span onClick={() => this.updateState(9)}>9</span>
                    <span onClick={() => this.updateCalculation('multiplication')}>x</span>
                </div>
                <div className="calculator-buttons">
                    <span onClick={() => this.updateState(6)}>6</span>
                    <span onClick={() => this.updateState(5)}>5</span>
                    <span onClick={() => this.updateState(4)}>4</span>
                    <span onClick={() => this.updateCalculation('minus')}>-</span>
                </div>
                <div className="calculator-buttons">
                    <span onClick={() => this.updateState(3)}>3</span>
                    <span onClick={() => this.updateState(2)}>2</span>
                    <span onClick={() => this.updateState(1)}>1</span>
                    <span onClick={() => this.updateCalculation('plus')}>+</span>
                </div>
                <div className="calculator-buttons">
                    <span onClick={() => this.reverse()}>&#177;</span>
                    <span onClick={() => this.updateState(0)}>0</span>
                    <span onClick={() => this.updateState('dot')}>.</span>
                    <span onClick={() => this.equal()}>=</span>
                </div>

                {/* Show only when the memory list button is clicked */}
                {this.state.showMemoryList &&
                    <div className="pop-up memory">
                        {this.state.memory.map((memory) =>
                            <p>{memory}</p>)}
                    </div>
                }

                {/* Show only when the history button is clicked */}
                {this.state.showList &&
                    <div className="pop-up">
                        <span>{this.state.allValues}</span>
                    </div>
                }
            </div>
        );
    }
}

export default App;
