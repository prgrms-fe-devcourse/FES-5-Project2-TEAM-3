export interface ProductionCountry {
	iso_3166_1: string;
	name: string;
}

export interface ProductionCompany {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}

export interface Genre {
	id: number;
	name: string;
}
export interface MovieDetailType {
  backdrop_path: string | null;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	genres: Genre[];
	id: number;
  overview: string | null;
  poster_path: string | null;
  release_date: string;
  runtime: number | null;
  tagline: string | null;
  title: string;
}


/*
{
    "adult": false,
    "backdrop_path": "https://image.tmdb.org/t/p/w500/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
    "belongs_to_collection": {
        "id": 86311,
        "name": "어벤져스 시리즈",
        "poster_path": "https://image.tmdb.org/t/p/w500/yFSIUVTCvgYrpalUktulvk3Gi5Y.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/w500/zuW6fOiusv4X9nnW3paHGfXcSll.jpg"
    },
    "budget": 220000000,
    "genres": [
        {
            "id": 878,
            "name": "SF"
        },
        {
            "id": 28,
            "name": "액션"
        },
        {
            "id": 12,
            "name": "모험"
        }
    ],
    "homepage": "",
    "id": 24428,
    "imdb_id": "tt0848228",
    "origin_country": [
        "US"
    ],
    "original_language": "en",
    "original_title": "The Avengers",
    "overview": "에너지원 큐브를 이용한 적의 등장으로 인류가 위험에 처하자 국제평화유지기구인 쉴드의 국장 닉 퓨리는 어벤져스 작전을 위해 전 세계에 흩어져 있던 슈퍼히어로들을 찾아나선다. 아이언맨부터 토르, 헐크, 캡틴 아메리카는 물론, 쉴드의 요원인 블랙 위도우, 호크 아이까지, 최고의 슈퍼히어로들이 어벤져스의 멤버로 모이게 되지만, 각기 개성이 강한 이들의 만남은 예상치 못한 방향으로 흘러가는데...",
    "popularity": 36.3802,
    "poster_path": "/krgjV3rJtBcEpQehODKXNCt6uFL.jpg",
    "production_companies": [
        {
            "id": 420,
            "logo_path": "/hUzeosd33nzE5MCNsZxCGEKTXaQ.png",
            "name": "Marvel Studios",
            "origin_country": "US"
        }
    ],
    "production_countries": [
        {
            "iso_3166_1": "US",
            "name": "United States of America"
        }
    ],
    "release_date": "2012-04-25",
    "revenue": 1518815515,
    "runtime": 142,
    "spoken_languages": [
        {
            "english_name": "English",
            "iso_639_1": "en",
            "name": "English"
        },
        {
            "english_name": "Hindi",
            "iso_639_1": "hi",
            "name": "हिन्दी"
        },
        {
            "english_name": "Russian",
            "iso_639_1": "ru",
            "name": "Pусский"
        }
    ],
    "status": "Released",
    "tagline": "최강의 슈퍼히어로들이 모였다.",
    "title": "어벤져스",
    "video": false,
    "vote_average": 7.783,
    "vote_count": 32562
}
*/