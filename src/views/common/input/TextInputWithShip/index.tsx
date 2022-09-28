import React from 'react';
import { Chip, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

function TextInputWithShip() {
    return (
        <div className="App">
            <Autocomplete
                multiple
                id="tags-filled"
                options={[]}
                freeSolo
                renderTags={(value: string[], getTagProps) => (
                    value.map((option: string, index: number) => (
                        <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                        />
                    ))
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="filled"
                        label="freeSolo"
                        placeholder="Favorites"
                    />
                )}
            />
        </div>
    );
}

export default TextInputWithShip;
