import React from 'react'
import classNames from 'classnames'
import isequal from 'lodash.isequal'
import { Icon } from 'antd'

export default class Sort extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }

    assitShouldComponent = (target) => {
        let obj = {}
        for( const [key, value] of Object.entries(target) ) {
            if( typeof(value) != 'function' ) {
                obj[key] = value
            }
        }
        return obj
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log((isequal(this.props, nextProps) && isequal(this.state, nextState)))
        return !(isequal(this.assitShouldComponent(this.props), this.assitShouldComponent(nextProps)) && isequal(this.state, nextState))
    }

    handleClick=(value)=>{
        let flag
        let { sortOrder, handleClick } = this.props
        switch(value){
            case 'desc':
                sortOrder == 'desc' ? flag = false : flag = 'desc'
                break
            case 'asc':
                sortOrder == 'asc' ? flag = false : flag = 'asc'
                break
        }
        if( handleClick ){
            handleClick(flag)
        }
    }
    render(){
        const props = this.props
        const { sortOrder } = props
        const className = classNames({
            'mk-table-sort': true,
            [props.className]: !!props.className
        })
        return (
            <div className={className}>
                {this.props.title}
                <div className="icon">
                    <span 
                        className={`${sortOrder == 'asc' ? 'active': ''}`}
                        onClick={()=>{this.handleClick('asc')}}
                    >
                        <i className='anticon mk-icon edficon edficon-shang' />
                    </span>
                    <span 
                        className={`${sortOrder == 'desc' ? 'active': ''}`}
                        onClick={()=>{this.handleClick('desc')}}
                    >
                        <i className='anticon mk-icon edficon edficon-xia' />
                    </span>
                </div>
            </div>
        )
    }
}