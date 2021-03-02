import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    renderEmotions(){
        const { emotions = {} } = this.props;
        return Object.keys(emotions).map((key, i) => {
            return (
            <React.Fragment>
                <tr key={i}>
                    <td>{key}</td>
                    <td>{emotions[key]}</td>
                </tr>
            </React.Fragment>);
        });

    }
    render() {
      return (  
        <div>
          <table className="table table-bordered">
            <tbody>
            {
                this.renderEmotions()
            }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;
