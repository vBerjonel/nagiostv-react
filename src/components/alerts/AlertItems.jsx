import React, { Component } from 'react';
import { translate } from '../../helpers/language';

import AlertItem from './AlertItem.jsx';
import QuietFor from './QuietFor.jsx';
// css
import '../animation.css';
import '../services/ServiceItems.css';
import './AlertItems.css';

class AlertItems extends Component {

  constructor(props) {
    super(props);

    this.showMore = this.showMore.bind(this);
    this.showLess = this.showLess.bind(this);
  }

  state = {
    howManyToRender: 20,
    pageSize: 50
  };

  showMore() {
    this.setState({
      howManyToRender: this.state.howManyToRender + this.state.pageSize
    });
  }

  showLess() {
    this.setState({
      howManyToRender: this.state.howManyToRender - this.state.pageSize
    });
  }

  render() {

    let trimmedItems = [...this.props.items];
    trimmedItems.length = this.state.howManyToRender;
    const { language } = this.props.settings;

    return (
      <div className="AlertItems">
        {/* always show one quiet for (if we have at least 1 item) */}
        {this.props.items.length > 1 &&
          <QuietFor
            first
            nowtime={new Date().getTime()}
            prevtime={this.props.items[0].timestamp}
            showEmoji={this.props.settings.showEmoji}
            language={language}
          />
        }
        
        {/* loop through the trimmed items */}        
        {trimmedItems.map((e, i) => {
          const host = (e.object_type === 1 ? e.name : e.host_name);
          const prevtime = (i > 1 ? this.props.items[i-1].timestamp : 0);
          return (
            <AlertItem
              key={'alert-' + host + '-' + e.object_type + '-' + e.timestamp + '-' + i}
              e={e}
              i={i}
              prevtime={prevtime}
              showEmoji={this.props.showEmoji}
              language={language}
            />
          );
        })}
        
        <div className="ShowMoreArea">
          {this.state.howManyToRender > this.state.pageSize &&
            <span>
              <button className="uppercase-first" onClick={this.showLess}>{translate('show less', language)}</button>
            </span>
          }
          {this.props.items.length > this.state.howManyToRender &&
            <span>
              <button className="uppercase-first" onClick={this.showMore}>{translate('show more', language)}</button>
            </span>
          }
        </div>
      </div>
    );
  }
}

export default AlertItems;
