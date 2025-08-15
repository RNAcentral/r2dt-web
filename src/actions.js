/*
 This file handles the API requests
*/

import routes from './routes';

export async function onSubmit(body) {
    try {
        const response = await fetch(routes.submitJob(), {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body,
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const jobId = await response.text();
        return await fetchStatus(jobId);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchStatus(jobId) {
    try {
        const response = await fetch(routes.jobStatus(jobId), {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.text();

        if (data === 'RUNNING' || data === 'QUEUED') {
            await new Promise(r => setTimeout(r, 2000));
            return await fetchStatus(jobId);
        } else if (data === 'FINISHED') {
            const [fastaData, svgData, tsvData] = await Promise.all([
                getFasta(jobId),
                getSvg(jobId),
                getTsv(jobId),
            ]);
            return {
                dotBracketNotation: fastaData.dotBracketNotation,
                fastaHeader: fastaData.fastaHeader,
                jobId: jobId,
                sequence: fastaData.sequence,
                svg: svgData,
                tsv: tsvData
            };
        } else if (data === 'NOT_FOUND') {
             return 'NOT_FOUND';
        } else if (data === 'FAILURE') {
            return 'FAILURE';
        } else if (data === 'ERROR') {
            return 'ERROR';
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getSvg(jobId) {
    try {
        const response = await fetch(routes.fetchSvg(jobId), {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getFasta(jobId) {
    try {
        const response = await fetch(routes.fetchFasta(jobId), {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.text();
        const lines = (data.match(/[^\r\n]+/g)) || [];
        const fastaHeader = lines[0] || '';
        const sequence = lines[1] || '';
        const dotBracketNotation = lines[2] || '';
        return { fastaHeader: fastaHeader, sequence: sequence, dotBracketNotation: dotBracketNotation };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getTsv(jobId) {
    try {
        const response = await fetch(routes.fetchTsv(jobId), {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.text();
        const lines = (data.match(/[^\t]+/g));
        const template = lines[1];
        const source = lines[2].trimEnd();
        return { template: template, source: source };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchSvgFromUrl(url) {
    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.text();

        if (data.startsWith('<svg')) {
            return {
                dotBracketNotation: '',
                fastaHeader: '',
                jobId: '',
                sequence: '',
                svg: data,
                tsv: {source: '', template: ''}
            };
        } else {
            return 'NO_SVG';
        }
    } catch (error) {
        console.error(error);
        return 'NO_SVG';
    }
}
