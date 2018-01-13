import React, { Component } from 'react';
import { 
    View, 
    Animated,
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager 
} from 'react-native';

//this file has our deck of cards rendering and animations

// constants related to the screen and swipe threshold
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THREHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATON = 250


export default class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }

    constructor(props) {
        super(props);

        //set a starter position for our cards
        const position = new Animated.ValueXY();        
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => { 
                //every time something is clicked we use dx and dy 
                //to change the position of our list of cards
                // to follow the move of the click                               
                position.setValue({ x: gesture.dx, y: gesture.dy })
            },
            onPanResponderRelease: (event, gesture) => {
                if ( gesture.dx > SWIPE_THREHOLD ){
                    this.forceSwipe('right');
                } else if( gesture.dx < -SWIPE_THREHOLD ){
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }                
            }                        
        });

        this.state = { panResponder, position, index: 0 };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data ) {
            this.setState({ index: 0 });
        }        
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

        LayoutAnimation.spring();
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x: 0, y: 0});
        this.setState({ index: this.state.index + 1 });
    }


    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position ,{
            toValue: {x , y: 0 },
            duration: SWIPE_OUT_DURATON
        }).start(() => { this.onSwipeComplete(direction) });
    }

    // Move our card to initial position
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }            
        }).start();
    }

//  related to rotating etc...
    getCardStyle() {
        const { position } = this.state;

        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5 , 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg','0deg','120deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        };
    }

    renderCards() {
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards()
        }


        return this.props.data.map( (item, i ) => {
            if( i < this.state.index) { return null ;}
            if (i === this.state.index ) {
                return (
                    <Animated.View
                    key={item.id}
                    // zIndex is to so the element to be dragged (animated)
                    // keeps always infront of all the zIndex of 0
                    style={[this.getCardStyle(), styles.cardStyle, { zIndex: 1}]}
                    {...this.state.panResponder.panHandlers}
                    >
                    {this.props.renderCard(item)}
                    </Animated.View>
                );
            }

            // return this.props.renderCard(item);
                 return (
                <Animated.View 
                 key={item.id}
                 style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}
                 >
                    {this.props.renderCard(item)}
                </Animated.View>
            );
            
        // });   
         }).reverse();           
               
    }

  render() {
    return (
        <View>
            {this.renderCards()}
        </View>
    );
  }
};

const styles = {
    cardStyle: {                
        position:'absolute',            
        width: SCREEN_WIDTH,            
        zIndex: 0
    }
};

