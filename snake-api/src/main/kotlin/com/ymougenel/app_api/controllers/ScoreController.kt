package com.ymougenel.app_api

import com.ymougenel.app_api.entities.Score
import com.ymougenel.app_api.persistence.ScoreDAO
import org.springframework.web.bind.annotation.*
import org.springframework.beans.factory.annotation.Autowired


@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = ["*"])
class ScoreController {

    lateinit var scoreDAO: ScoreDAO
    @Autowired
    fun ScoreController(scoreDAO: ScoreDAO) {
        this.scoreDAO = scoreDAO
    }

    @GetMapping("/")
    fun getScores(): List<Score> {
        return this.scoreDAO.findAll().sortedWith(compareBy { it.score }).asReversed()
    }

    @PostMapping("/")
    fun postScores(@RequestBody score: Score): Score {
        return this.scoreDAO.save(score)
    }
}