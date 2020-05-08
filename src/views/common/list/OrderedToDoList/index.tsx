import React, { useState, FormEvent } from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import TextInput from '../../input/TextInput';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import IconButton from '@material-ui/core/IconButton';
// import DeleteIcon from '@material-ui/icons/Delete';

interface IPublicProps {
    title: string;
}

interface ITodoProps {
    todo: {[key: string]: string};
    index: number;
    removeTodo: (index: number) => void;
}

interface ITodoForm {
    addTodo: (value: string) => void;
}

const useStyles = makeStyles(({ spacing, typography }) => ({
    title: {

    },
    list: {},
    item: {
        marginInlineStart: 0,
        paddingBottom: spacing(1),
        fontSize: typography.pxToRem(14),
    },
}));

function Todo({ todo, index, removeTodo }: ITodoProps) {
    return (
        <div className="todo">
            {todo.text}

            <div>
                <button type="button" onClick={() => removeTodo(index)}>x</button>
            </div>
        </div>
    );
}

function TodoForm({ addTodo }: ITodoForm) {
    const [value, setValue] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!value) return;

        addTodo(value);
        setValue('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextInput value={value} onChange={(e) => setValue(e.target.value)} />
        </form>
    );
}

export default function OrderedToDoList({ title }: IPublicProps) {
    const [todos, setTodos] = useState([]);
    const classes = useStyles();

    function addTodo(text: string): void {
        const newTodos = [...todos, { text }];
        setTodos(newTodos);
    }

    function removeTodo(index: number): void {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    }

    return (
        <Box>
            <Typography className={classes.title}>{title}</Typography>
            {todos.map((todo, index) => (
                <Todo index={index} todo={todo} removeTodo={removeTodo} />
            ))}
            <TodoForm addTodo={addTodo} />
        </Box>
    );
}
