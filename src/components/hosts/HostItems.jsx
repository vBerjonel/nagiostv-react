import React, { Component } from 'react';
import { translate } from '../../helpers/language';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import HostItem from './HostItem';

// css
import './HostItems.css';

class HostItems extends Component {

  render() {

    //console.log('this.props.hostProblemsArray is', this.props.hostProblemsArray);
    //console.log(Object.keys(this.props.hostProblemsArray));

    const filteredHostProblemsArray = this.props.hostProblemsArray.filter(item => {
      if (this.props.settings.hideHostPending) {
        if (item.status === 1) { return false; }
      }
      if (this.props.settings.hideHostDown) {
        if (item.status === 4) { return false; }
      }
      if (this.props.settings.hideHostUnreachable) {
        if (item.status === 8) { return false; }
      }
      if (this.props.settings.hideHostAcked) {
        if (item.problem_has_been_acknowledged) { return false; }
      }
      if (this.props.settings.hideHostScheduled) {
        if (item.scheduled_downtime_depth > 0) { return false; }
      }
      if (this.props.settings.hideHostFlapping) {
        if (item.is_flapping) { return false; }
      }
      return true;
    });

    const howManyHidden = this.props.hostProblemsArray.length - filteredHostProblemsArray.length;
    const showSomeDownItems = this.props.hostProblemsArray.length > 0 && filteredHostProblemsArray.length === 0;
    const { language } = this.props.settings;

    return (
      <div className="ServiceItems">

        <div className={`all-ok-item ${this.props.hostProblemsArray.length === 0 ? 'visible' : 'hidden'}`}>
          <span style={{ margin: '5px 10px' }} className="margin-left-10 display-inline-block color-green">{translate('All', language)} {this.props.howManyHosts} {translate('hosts are UP', language)}</span>{' '}
        </div>

        <div className={`some-down-items ${showSomeDownItems ? 'visible' : 'hidden'}`}>
          <div>
            <span className="display-inline-block color-green" style={{ marginRight: '10px' }}>{this.props.howManyHosts - this.props.hostProblemsArray.length} {translate('hosts are UP', language)}</span>{' '}
            <span className="some-down-hidden-text">({howManyHidden} hidden)</span>
          </div>
        </div>

        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {filteredHostProblemsArray.map((e, i) => {
            //console.log('HostItem item');
            //console.log(e, i);

            // find comment for this hostitem
            let comment = '';
            let comment_author = '';
            let comment_entry_time = '';
            const commentlist = this.props.commentlist;
            Object.keys(commentlist).forEach((id) => {
              if (commentlist[id].comment_type === 1 && e.name === commentlist[id].host_name) {
                comment = commentlist[id].comment_data;
                comment_author = commentlist[id].author;
                comment_entry_time = commentlist[id].entry_time;
              }
            });

            return (
              <HostItem
                key={e.name}
                settings={this.props.settings}
                hostItem={e}
                comment={comment}
                comment_author={comment_author}
                comment_entry_time={comment_entry_time}
              />
            );
            
          })}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default HostItems;
